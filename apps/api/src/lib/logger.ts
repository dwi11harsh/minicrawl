import winston from 'winston';
import { config } from '../config';

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
	level: config.LOGGER_LEVEL,
	format: config.ENV === 'dev' ? devFormat : prodFormat,
	transports: [new winston.transports.Console()],
});
