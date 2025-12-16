import { createServer } from '@repo/express-server';

const PORT = process.env.PORT || 3001;

const app = createServer();

app.get('/helth', (req, res) => {
	res.json({ health: 'OK' }).status(200);
});

app.listen(PORT, () => {
	console.log('port: ', PORT);
});
