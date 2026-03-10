import express from 'express';
import { V0BatchScrape, V0Scrape } from '../routes';

const v0Router = express.Router();

v0Router.get('/health', (_, res) => {
	res.status(200).json({ data: 'v0 is alive' });
});

v0Router.post('/scrape', V0Scrape);

v0Router.post('/scrape/batch', V0BatchScrape);

export default v0Router;
