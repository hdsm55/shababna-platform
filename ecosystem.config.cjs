module.exports = {
  apps: [
    {
      name: 'shababna-server',
      script: 'server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000,
        HOST: process.env.HOST || '0.0.0.0',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      max_restarts: 10,
      min_uptime: '10s',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
    },
  ],
};
