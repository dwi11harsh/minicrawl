#!/usr/bin/env bun
import { config as dotenvConfig } from 'dotenv';
import { ScraperEngine } from './lib/scraper';

dotenvConfig({ path: __dirname + '/.env' });

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`[PID ${process.pid}] No arguments provided. Exiting.`);
	process.exit(1);
}

console.log(`[PID ${process.pid}] Starting ScraperEngine for args:`, args);

for (const arg of args) {
	ScraperEngine(arg).catch(err => {
		console.error(
			`[PID ${process.pid}] ScraperEngine failed for arg "${arg}":`,
			err,
		);
	});
}

process.on('SIGTERM', () => {
	console.log(`[PID ${process.pid}] Received SIGTERM, shutting down.`);
	process.exit(0);
});
