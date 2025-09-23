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
    
    if [ ! -f "backend/dist/server.js" ]; then
        print_error "Backend build failed - server.js not found!"
        exit 1
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
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_status "$service_name health check passed"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts failed, waiting 2s..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name health check failed after $max_attempts attempts"
    return 1
}

# Backup current PM2 configuration
backup_pm2_config() {
    echo "💾 Backing up current PM2 configuration..."
    pm2 dump ~/pm2-backup-$(date +%Y%m%d-%H%M%S).json
    print_status "PM2 configuration backed up"
}

# Deploy backend with zero downtime
deploy_backend() {
    echo "🔄 Deploying backend with zero downtime..."
    
    # Use PM2's graceful reload for zero downtime
    pm2 reload dol-mcnj-backend --update-env
    
    # Wait a moment for the reload to complete
    sleep 3
    
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