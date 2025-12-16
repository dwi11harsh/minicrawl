import { createServer, wrap } from '@repo/express-server';
import { Request, Response } from 'express';
import { v1Router } from './routes/v1.js';
const PORT = process.env.PORT || 3001;

const app = createServer();

app.get(
	'/health',
	wrap(async (_req: Request, res: Response) => {
		res.json({ health: 'OK' }).status(200);
	}),
);

app.use('/v1', v1Router);

app.listen(PORT, () => {
	console.log('port: ', PORT);
});
