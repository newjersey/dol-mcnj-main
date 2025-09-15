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
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'dol-mcnj-backend',
      script: './dist/server.js',
      cwd: './backend/',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M'
    }
  ]
}
