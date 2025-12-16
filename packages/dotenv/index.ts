import { EnvError } from '@repo/error';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

export const PORT = process.env.PORT;
if (!PORT) {
	throw new EnvError('Missing required environment variable', 'PORT');
}
