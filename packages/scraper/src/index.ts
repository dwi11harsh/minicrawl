import { Document } from '@repo/types';
import { axiosEngine } from './engines/axiosEngine';

export const scrapeWithEngine = async (url: string): Promise<Document> => {
	let response = await axiosEngine(url);
	return response;
};
