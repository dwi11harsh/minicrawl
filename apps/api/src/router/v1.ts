import express from 'express';
import { V1BatchScrape, V1Crawl, V1Scrape } from '../routes';

const v1Router = express.Router();

v1Router.get('/health', (_, res) => {
	res.status(200).json({ data: 'v1 is alive' });
});

v1Router.post('/scrape', V1Scrape);

v1Router.post('/scrape/batch', V1BatchScrape);

v1Router.post('/crawl', V1Crawl);

export default v1Router;
