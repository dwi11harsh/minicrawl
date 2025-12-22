import { CreateServer } from '@mc/express-server';
import logger from '@mc/logger';
import { Express } from 'express';

const PORT = process.env.PORT || 3005;

const app: Express = CreateServer();

app.get('/health', async (_req, res) => {
	res.status(201).json({
		health: 'OK',
		message: 'minicrawl is up and running',
	});
});

app.listen(PORT, () => {
	logger.info(`Server is listening on port: ${PORT}`, 'green');
});
