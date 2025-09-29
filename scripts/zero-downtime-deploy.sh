#!/bin/bash
set -e

echo "🚀 Starting Zero-Downtime Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if PM2 is running and apps exist
check_pm2_status() {
    if ! pm2 list | grep -q "dol-mcnj"; then
        print_error "No dol-mcnj applications found in PM2. Please run ./scripts/prod-start.sh first."
        exit 1
    fi
    print_status "PM2 applications found"
}

# Build the applications
build_applications() {
    echo "🔨 Building applications..."
    npm run build:only
    
    # Debug: Show what was actually built
    echo "📋 Contents of backend/dist/:"
    ls -la backend/dist/ || echo "backend/dist/ directory not found"
    
    # Validate backend build
    if [ ! -f "backend/dist/server.js" ]; then
        print_error "Backend build failed - server.js not found!"
        echo "🔍 Searching for .js files in backend/dist/:"
        find backend/dist/ -name "*.js" -type f || echo "No .js files found"
        exit 1
    fi
    
    # Copy frontend build to backend for serving
    echo "📁 Copying frontend build to backend..."
    if [ -d ".next" ]; then
        mkdir -p backend/dist/build
        # Copy Next.js build output
        cp -r .next/* backend/dist/build/ 2>/dev/null || true
        # Copy public assets
        cp -r public/* backend/dist/build/ 2>/dev/null || true
        
        # Create index.html if it doesn't exist (Next.js may not generate one)
        if [ ! -f "backend/dist/build/index.html" ]; then
            echo "📄 Creating placeholder index.html for backend serving..."
            cat > backend/dist/build/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>NJ DOL Career Navigator</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="__next"></div>
    <script>
        // Redirect to the Next.js application
        window.location.href = '/';
    </script>
</body>
</html>
EOF
        fi
        
        echo "✅ Frontend build copied to backend/dist/build/"
        echo "📋 Contents of backend/dist/build/:"
        ls -la backend/dist/build/ | head -10
    else
        print_warning "Frontend .next build directory not found"
    fi
    
    print_status "Applications built successfully"
}

# Health check function
health_check() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    echo "🏥 Performing health check for $service_name..."
    echo "🔗 Testing URL: $url"
    
    while [ $attempt -le $max_attempts ]; do
        # Test the URL and capture response
        local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        local curl_exit_code=$?
        
        if [ "$response_code" = "200" ]; then
            print_status "$service_name health check passed (HTTP $response_code)"
            return 0
        fi
        
        # Show more detailed error info every 5 attempts
        if [ $((attempt % 5)) -eq 1 ]; then
            echo "   🔍 Debug info (attempt $attempt/$max_attempts):"
            echo "     HTTP response code: $response_code"
            echo "     Curl exit code: $curl_exit_code"
            
            # Check if the service is running in PM2
            if [ "$service_name" = "Backend" ]; then
                echo "     PM2 backend status:"
                pm2 describe dol-mcnj-backend --silent 2>/dev/null | grep -E "(status|pid|memory)" || echo "     Could not get PM2 status"
                echo "     Recent backend logs:"
                pm2 logs dol-mcnj-backend --lines 3 --nostream 2>/dev/null || echo "     Could not get logs"
            fi
        else
            echo "   Attempt $attempt/$max_attempts failed (HTTP $response_code), waiting 2s..."
        fi
        
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name health check failed after $max_attempts attempts"
    print_error "Final response code: $response_code"
    return 1
}

# Backup current PM2 configuration
backup_pm2_config() {
    echo "💾 Backing up current PM2 configuration..."
    pm2 dump
    cp ~/.pm2/dump.pm2 ~/pm2-backup-$(date +%Y%m%d-%H%M%S).json
    print_status "PM2 configuration backed up"
}

# Deploy backend with zero downtime
deploy_backend() {
    echo "🔄 Deploying backend with zero downtime..."
    
    # Use PM2's graceful reload for zero downtime
    pm2 reload dol-mcnj-backend --update-env
    
    # Wait a moment for the reload to complete
    sleep 5
    
    # Check if the port is listening
    echo "🔍 Checking if port 8080 is listening..."
    if netstat -ln 2>/dev/null | grep ":8080 " >/dev/null || ss -ln 2>/dev/null | grep ":8080 " >/dev/null; then
        echo "✅ Port 8080 is listening"
    else
        echo "❌ Port 8080 is not listening"
        echo "📋 Current PM2 status:"
        pm2 list
        echo "📋 Recent backend logs:"
        pm2 logs dol-mcnj-backend --lines 10 --nostream
    fi
    
    # Health check
    if ! health_check "Backend" "http://localhost:8080/health"; then
        print_error "Backend deployment failed health check"
        echo "🔙 Rolling back backend..."
        pm2 restart dol-mcnj-backend
        return 1
    fi
    
    print_status "Backend deployed successfully"
}

# Deploy frontend with zero downtime
deploy_frontend() {
    echo "🔄 Deploying frontend with zero downtime..."
    
    # For Next.js, we need to be more careful since it's a full application restart
    # Use PM2's graceful reload
    pm2 reload dol-mcnj-frontend --update-env
    
    # Wait for the application to start
    sleep 5
    
    # Health check
    if ! health_check "Frontend" "http://localhost:3000"; then
        print_error "Frontend deployment failed health check"
        echo "🔙 Rolling back frontend..."
        pm2 restart dol-mcnj-frontend
        return 1
    fi
    
    print_status "Frontend deployed successfully"
}

# Main deployment flow
main() {
    echo "🚀 Starting Zero-Downtime Deployment at $(date)"
    
    # Pre-deployment checks
    check_pm2_status
    
    # Build applications
    build_applications
    
    # Backup PM2 config
    backup_pm2_config
    
    # Set NODE_ENV if not set
    export NODE_ENV=${NODE_ENV:-awstest}
    
    # Deploy backend first
    if deploy_backend; then
        print_status "Backend deployment successful"
    else
        print_error "Backend deployment failed - stopping deployment"
        exit 1
    fi
    
    # Deploy frontend
    if deploy_frontend; then
        print_status "Frontend deployment successful"
    else
        print_error "Frontend deployment failed - backend was updated successfully"
        exit 1
    fi
    
    # Save PM2 configuration
    pm2 save
    
    echo ""
    print_status "🎉 Zero-Downtime Deployment Complete!"
    echo "📊 Current status:"
    pm2 status
    
    echo ""
    echo "🌐 Services:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:8080"
    
    # Final health checks
    echo ""
    echo "🏥 Final health verification:"
    health_check "Frontend" "http://localhost:3000" && print_status "Frontend is healthy"
    health_check "Backend" "http://localhost:8080/health" && print_status "Backend is healthy"
}

# Run main function
main "$@"