import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';

dotenv.config({
	path: path.join(__dirname, '../../.env'),
});

const logLevel = process.env.LOGGER_LEVEL!;

const devFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp({ format: 'HH:mm:ss' }),
	winston.format.printf(({ timestamp, level, message, ...meta }) => {
		const metaStr = Object.keys(meta).length
			? ' ' + JSON.stringify(meta)
			: '';
		return `[${timestamp}] ${level}: ${message}${metaStr}`;
	}),
);

const prodFormat = winston.format.json();

export const logger = winston.createLogger({
	level: logLevel,
	format: logLevel === 'dev' ? devFormat : prodFormat,
	transports: [new winston.transports.Console()],
});
