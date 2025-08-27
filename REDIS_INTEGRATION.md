# Redis Integration Documentation

This document provides comprehensive documentation for the Redis integration implemented in the My Career NJ application.

## Overview

The Redis integration enhances the existing training search and program lookup functionality by leveraging AWS ElastiCache Redis for improved performance, scalability, and caching capabilities. The implementation maintains backward compatibility and provides fallback mechanisms to PostgreSQL when Redis is unavailable.

## Architecture

### Components

1. **Enhanced Redis Client** (`redisClient.ts`)
   - Improved connection management with cluster support
   - Comprehensive error handling and health checks
   - Automatic reconnection and monitoring

2. **Redis Data Client** (`RedisDataClient.ts`)
   - Full DataClient interface implementation with Redis caching
   - Automatic fallback to PostgreSQL for cache misses
   - Training data indexing and search capabilities

3. **Cache Warming Service** (`CacheWarmingService.ts`)
   - Automated cache warming for critical data
   - Configurable batch processing
   - Support for different warming strategies

4. **Monitoring Service** (`RedisMonitoringService.ts`)
   - Real-time performance monitoring
   - Metrics collection and alerting
   - Health status tracking

## Configuration

### Environment Variables

Add the following environment variables to enable Redis integration:

```bash
# Enable/disable Redis
REDIS_ENABLED=true

# Redis connection settings
REDIS_HOST=your-redis-host.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TLS=true

# Redis clustering (for high availability)
REDIS_CLUSTER_MODE=false

# Redis database and key settings
REDIS_KEY_PREFIX=mycareernj:
REDIS_DB=0

# Cache warming
REDIS_AUTO_WARMING=true
```

### AWS ElastiCache Configuration

For production deployment, configure ElastiCache with:

- **Engine**: Redis 7.x
- **Node Type**: cache.r6g.large or higher
- **Cluster Mode**: Enabled for high availability
- **Encryption**: In-transit and at-rest
- **Backup**: Automatic daily backups

## Usage

### Basic Implementation

The Redis integration is automatically enabled when `REDIS_ENABLED=true` is set. The application will:

1. Initialize Redis connection at startup
2. Use Redis data client with PostgreSQL fallback
3. Start monitoring and cache warming services
4. Expose health check and management endpoints

### API Endpoints

#### Health Check
```
GET /api/health/redis
```
Returns Redis connection status and health metrics.

#### Metrics
```
GET /api/metrics/redis
```
Returns detailed Redis performance metrics.

#### Monitoring Report
```
GET /api/report/redis
```
Returns a comprehensive monitoring report with recommendations.

#### Cache Warming
```
POST /api/cache/warm
Content-Type: application/json

{
  "type": "critical"  // or "training", "search"
  "trainingIds": ["id1", "id2"]  // for training type
  "queries": ["nursing", "programming"]  // for search type
}
```

#### Cache Management
```
DELETE /api/cache/clear?pattern=training:*
```
Clears cache entries matching the specified pattern.

## Data Models

### Redis Key Structure

The implementation uses a structured key naming convention:

```
mycareernj:training:{ctid}                    # Training data
mycareernj:idx:trainings:category:{category}  # Category index
mycareernj:idx:trainings:location:{location}  # Location index
mycareernj:idx:trainings:keyword:{keyword}    # Keyword index
mycareernj:idx:trainings:cip:{cipcode}        # CIP code index
mycareernj:idx:trainings:soc:{soccode}        # SOC code index
mycareernj:idx:trainings:provider:{provider}  # Provider index
mycareernj:occupations:cip:{cipcode}          # Occupation data
mycareernj:soc:definition:{soccode}           # SOC definitions
```

### TTL Settings

- Training data: 1 hour (3600 seconds)
- Search results: 15 minutes (900 seconds)
- Critical data: 2 hours (7200 seconds)
- Metadata: 30 minutes (1800 seconds)

## Performance Optimization

### Cache Warming Strategies

1. **Critical Data Warming**
   - In-demand occupations and CIPs
   - Local exceptions
   - Occupation definitions

2. **Training Data Warming**
   - Popular training programs
   - Recently accessed trainings
   - Provider information

3. **Search Data Warming**
   - Common search queries
   - Location-based searches
   - Category-specific searches

### Monitoring Metrics

The system tracks:
- Connection status and health
- Memory usage and key count
- Hit/miss rates
- Operations per second
- Average response times
- Error counts

## Credential Engine API Caching

### Enhanced Caching Service

The `CredentialEngineCacheService` provides comprehensive caching for all Credential Engine API calls to dramatically improve performance and reduce external API load.

#### Cached Operations

1. **Search Results Caching** (`getResults`)
   - Caches training program search queries
   - TTL: 30 minutes (1800 seconds)
   - Intelligent cache key generation based on query parameters

2. **Resource Data Caching** (`getResourceByCTID`)
   - Caches detailed resource information by CTID
   - TTL: 2 hours (7200 seconds)
   - Ideal for provider and program details that change infrequently

3. **Graph Data Caching** (`getGraphByCTID`)
   - Caches graphical representation data
   - TTL: 2 hours (7200 seconds)
   - Optimizes complex relationship queries

4. **Envelope Data Caching** (`getEnvelopeByCTID`)
   - Caches envelope metadata and validation information
   - TTL: 2 hours (7200 seconds)
   - Critical for authorization and data integrity checks

#### Cache Management API Endpoints

The application provides dedicated endpoints for managing credential engine cache:

```http
# Get cache statistics
GET /api/cache/credential-engine/stats

# Warm cache with specific CTIDs
POST /api/cache/credential-engine/warm
Content-Type: application/json
{
  "ctids": ["ce-12345", "ce-67890", "ce-abcdef"]
}

# Clear all credential engine cache
DELETE /api/cache/credential-engine/clear
```

#### Cache Warming Strategy

The system automatically warms credential engine cache during application startup:

1. **Training Program CTIDs**: Caches most recent and popular programs
2. **Provider Information**: Pre-loads provider details for active programs
3. **Batch Processing**: Processes CTIDs in configurable batches to prevent overload
4. **Intelligent Selection**: Prioritizes in-demand occupations and CIP programs

#### Performance Benefits

- **Response Time**: Sub-millisecond cache hits vs. API call latency
- **API Load Reduction**: Significant decrease in external API calls
- **Cost Optimization**: Reduced bandwidth and API usage costs
- **Reliability**: Improved resilience to external API issues

#### Cache Key Structure

```
ce_api:search:[hash]_[skip]_[take]     # Search results
ce_api:resource:[ctid]                 # Resource data
ce_api:graph:[ctid]                    # Graph data  
ce_api:envelope:[ctid]                 # Envelope data
```

#### Fallback Behavior

When Redis is unavailable or cache operations fail:
- Automatic fallback to direct Credential Engine API calls
- Error logging and Sentry integration
- Zero downtime during cache failures
- Transparent operation for client applications

## Error Handling and Fallback

### Fallback Mechanisms

1. **Connection Failures**: Automatic fallback to PostgreSQL
2. **Operation Timeouts**: Graceful degradation with logging
3. **Cache Misses**: Transparent fallback to primary data source
4. **Memory Pressure**: Automatic eviction policies

### Error Scenarios

- **Redis Unavailable**: Application continues using PostgreSQL only
- **Partial Failures**: Individual operations fail gracefully
- **Data Corruption**: Automatic cache invalidation and refresh
- **Memory Limits**: LRU eviction with performance monitoring

## Deployment Guide

### Development Environment

1. Install Redis locally or use Docker:
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

2. Set environment variables:
   ```bash
   export REDIS_ENABLED=true
   export REDIS_HOST=localhost
   export REDIS_PORT=6379
   ```

3. Start the application:
   ```bash
   npm run start:dev
   ```

### Production Deployment

1. **Provision ElastiCache**:
   - Create Redis cluster in AWS
   - Configure security groups
   - Enable encryption and backup

2. **Update Environment Variables**:
   ```bash
   REDIS_ENABLED=true
   REDIS_HOST=your-cluster.cache.amazonaws.com
   REDIS_TLS=true
   REDIS_CLUSTER_MODE=true
   ```

3. **Deploy Application**:
   - Update application configuration
   - Deploy with zero-downtime strategy
   - Monitor health checks

## Monitoring and Alerting

### Key Metrics to Monitor

1. **Connection Health**
   - Redis connectivity status
   - Connection pool utilization
   - Reconnection attempts

2. **Performance Metrics**
   - Cache hit/miss ratios
   - Average response times
   - Operations per second

3. **Resource Usage**
   - Memory utilization
   - CPU usage
   - Network throughput

### Alerting Thresholds

- **Critical**: Redis connection down
- **Warning**: Hit rate < 80%
- **Warning**: Response time > 500ms
- **Info**: Memory usage > 80%

## Troubleshooting

### Common Issues

1. **Connection Timeouts**
   - Check network connectivity
   - Verify security group settings
   - Review connection pool configuration

2. **High Memory Usage**
   - Review TTL settings
   - Check for memory leaks
   - Consider key eviction policies

3. **Poor Cache Performance**
   - Analyze cache hit rates
   - Review cache warming strategies
   - Optimize key distribution

### Debugging Tools

1. **Health Check Endpoint**: `/api/health/redis`
2. **Metrics Dashboard**: `/api/metrics/redis`
3. **Log Analysis**: Check application logs for Redis operations
4. **Redis CLI**: Direct Redis command execution

## Security Considerations

### Access Control

- Use IAM roles for ElastiCache access
- Implement VPC security groups
- Enable Redis AUTH if required

### Data Protection

- Enable encryption in transit (TLS)
- Enable encryption at rest
- Implement data anonymization for sensitive information

### Network Security

- Use private subnets for ElastiCache
- Configure VPC endpoints
- Implement network ACLs

## Performance Testing

### Load Testing

Test the Redis integration under various load conditions:

1. **Baseline Performance**: Without Redis enabled
2. **Cache Cold Start**: Redis enabled, empty cache
3. **Cache Warmed**: Redis enabled, pre-warmed cache
4. **High Load**: Sustained high request volume
5. **Failover**: Redis failure scenarios

### Benchmarking

Key performance indicators:
- Search response time improvement
- Database load reduction
- Application throughput increase
- Memory utilization efficiency

## Maintenance

### Regular Tasks

1. **Monitor Cache Performance**
   - Review hit/miss ratios
   - Analyze slow operations
   - Check memory usage trends

2. **Update Cache Strategies**
   - Adjust TTL settings based on usage patterns
   - Optimize cache warming schedules
   - Review key distribution

3. **Backup and Recovery**
   - Configure automatic backups
   - Test restoration procedures
   - Document recovery processes

### Capacity Planning

Monitor and plan for:
- Memory growth based on data volume
- Network bandwidth requirements
- Scaling strategy for increased load

## Future Enhancements

### Planned Improvements

1. **Advanced Caching Strategies**
   - Intelligent cache warming based on usage patterns
   - Predictive cache pre-loading
   - Multi-level cache hierarchy

2. **Enhanced Monitoring**
   - Real-time dashboards
   - Advanced alerting rules
   - Performance analytics

3. **Optimization Features**
   - Automatic cache tuning
   - Smart eviction policies
   - Geographic data distribution

### Integration Opportunities

- Session management
- Real-time analytics
- Message queuing
- Distributed locking