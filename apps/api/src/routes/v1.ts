import { wrap } from '@repo/express-server';
import express, { Request, Response } from 'express';

export const v1Router = express.Router();

v1Router.get(
	'/ping',
	wrap(async (_req: Request, res: Response) => {
		res.json({ message: 'v1 is alive' }).status(201);
		return;
	}),
);
