/** @type {import('pm2').StartOptions[]} */
module.exports = {
	apps: [
		{
			name: 'scraper-worker',
			script: 'bun',
			args: 'run src/start-worker.ts <your-arg-here>',
			cwd: __dirname,
			instances: 1, // increase to scale out
			exec_mode: 'fork', // 'fork' (default) or 'cluster'
			autorestart: true,
			watch: false,
			max_memory_restart: '512M',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
