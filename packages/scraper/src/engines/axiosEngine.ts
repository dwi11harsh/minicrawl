import { Document } from '@repo/types';
import axios from 'axios';

export const axiosEngine = async (
	url: string,
	options?: {
		timeout?: number;
		headers?: Record<string, string>;
	},
): Promise<Document> => {
	const response = await axios.get(url, {
		timeout: options?.timeout ?? 15000,
		headers: options?.headers,
	});

	return {
		url,
		html: response.data as string,
	};
};
