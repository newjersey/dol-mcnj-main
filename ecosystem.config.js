module.exports = {
  apps: [
    {
      name: 'dol-mcnj-frontend',
      script: 'npm',
      args: 'run start:frontend',
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
      script: 'npm',
      args: 'run start:backend',
      cwd: './',
      env: {
        NODE_ENV: 'awsdev',
        DB_ENV: 'awsdev',
        PORT: 8080
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M'
    }
  ]
}
