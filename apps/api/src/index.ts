import bodyParser from 'body-parser';
import express, { Application } from 'express';

const app: Application = express();
const port = 3000;

app.use(bodyParser.json());
app.disable('x-powered-by');

app.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		data: 'minicrawl is live',
	});
});

app.listen(port, () => {
	console.log('server listening at ', port);
});
