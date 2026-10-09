module.exports = {
  apps: [
    {
      name: 'sighya',
      cwd: __dirname,
      script: 'bun',
      args: 'server/index.ts',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        ALLOWED_HOSTS: 'sighya.fr,www.sighya.fr',
        TRUST_PROXY: '1',
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
}
