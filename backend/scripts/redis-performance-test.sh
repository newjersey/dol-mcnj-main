#!/bin/bash

# Redis Performance Test Script
# This script sets up and runs performance tests for Redis integration

echo "🚀 Redis Performance Test Runner"
echo "================================="
echo

# Check if Redis is running
echo "📋 Checking Redis availability..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running and accessible"
    else
        echo "❌ Redis is not responding. Starting local Redis..."
        if command -v redis-server &> /dev/null; then
            redis-server --daemonize yes --port 6379
            sleep 2
            if redis-cli ping &> /dev/null; then
                echo "✅ Local Redis started successfully"
            else
                echo "❌ Failed to start Redis. Please install and start Redis manually."
                exit 1
            fi
        else
            echo "❌ Redis not found. Please install Redis or set REDIS_HOST environment variable."
            exit 1
        fi
    fi
else
    echo "ℹ️  redis-cli not found. Assuming Redis is running on $REDIS_HOST"
fi

echo

# Set environment variables for testing
export REDIS_HOST=${REDIS_HOST:-localhost}
export REDIS_PORT=${REDIS_PORT:-6379}
export REDIS_ENABLED=true
export REDIS_KEY_PREFIX="test:performance:"

echo "🔧 Test Configuration:"
echo "  Redis Host: $REDIS_HOST"
echo "  Redis Port: $REDIS_PORT"
echo "  Key Prefix: $REDIS_KEY_PREFIX"
echo

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors and try again."
    exit 1
fi

echo "✅ Build successful"
echo

# Run the performance test
echo "🏃 Running Redis performance tests..."
echo "====================================="
echo

# Use ts-node to run the TypeScript test directly
npx ts-node src/test/redis-performance.ts

if [ $? -eq 0 ]; then
    echo
    echo "✅ Performance tests completed successfully!"
else
    echo
    echo "❌ Performance tests failed. Check the output above for details."
    exit 1
fi

echo
echo "📈 Performance test results saved above."
echo "💡 For production deployment, configure Redis with appropriate resources and monitoring."