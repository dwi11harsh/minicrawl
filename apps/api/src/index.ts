import { createServer } from '@repo/express-server';
import { wrap } from '@repo/express-server/wrap';
const PORT = process.env.PORT || 3001;

const app = createServer();

app.get(
	'/health',
	wrap(async (_req, res) => {
		res.json({ health: 'OK' }).status(200);
	}),
);

app.listen(PORT, () => {
	console.log('port: ', PORT);
});
