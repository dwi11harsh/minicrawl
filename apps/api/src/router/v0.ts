import express from 'express';

const v0Router = express.Router();

v0Router.get('/', (_, res) => {
	res.status(200).json({ data: 'v0 is alive' });
});

export default v0Router;
