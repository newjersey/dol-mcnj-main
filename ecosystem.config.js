module.exports = {
  apps: [
    {
      name: 'dol-mcnj-frontend',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1, // Keep as 1 for Next.js since it handles its own optimization
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      // Zero-downtime deployment settings
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 3
    },
    {
      name: 'dol-mcnj-backend',
      script: './dist/server.js',
      cwd: './backend/',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: 8080
      },
      instances: 2, // Use 2 instances for better zero-downtime reloads
      exec_mode: 'cluster', // Use cluster mode for zero-downtime reloads
      watch: false,
      max_memory_restart: '512M',
      // Zero-downtime deployment settings
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 3,
      // Graceful shutdown
      increment_var: 'PORT'
    }
  ],
  // Global PM2 settings for better zero-downtime deployments
  deploy: {
    production: {
      // These settings help with zero-downtime deployments
      'post-deploy': 'npm install && npm run build:only && pm2 reload ecosystem.config.js --env production'
    }
  }
}
