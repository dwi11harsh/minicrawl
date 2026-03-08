import express from 'express';
import { V0Scrape } from '../routes';

const v0Router = express.Router();

v0Router.get('/', (_, res) => {
	res.status(200).json({ data: 'v0 is alive' });
});

v0Router.post('/scrape', V0Scrape);

export default v0Router;
