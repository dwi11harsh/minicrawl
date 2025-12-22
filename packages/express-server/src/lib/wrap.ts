import { NextFunction, Request, Response } from 'express';

export const wrap = async (
	controller: (req: Request, res: Response) => Promise<void>,
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		controller(req, res).catch(err => next(err));
	};
};
