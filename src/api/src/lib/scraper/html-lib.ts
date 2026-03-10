import type { CleanHtmlOptions } from '@mc/types';
import * as cheerio from 'cheerio';

class HtmlLib {
	private $: cheerio.CheerioAPI;
	private url: URL;
	private options: CleanHtmlOptions;
	private baseUrl: URL;

	private alwaysRemove: string[] = [
		'script',
		'style',
		'noscript',
		'comment',
		'xml',
		'doctype',
	];

	constructor(rawHtml: string, baseUrl: string, options: CleanHtmlOptions) {
		this.url = new URL(baseUrl);
		this.$ = cheerio.load(rawHtml, {
			baseURI: this.url,
		});
		this.options = options;

		// for now baseUrl is same as url but will change in _resolveBaseTag method
		this.baseUrl = new URL(baseUrl);
	}

	public _resolveBaseTag = () => {
		// from <base>
		let href = this.$('base').first().attr('href');
		if (href && href.length > 0 && href.startsWith('http')) {
			this.baseUrl = new URL(href);
			return;
		}

		// from <meta>
		href = this.$('meta[property="og:url"]').first().attr('content');
	};
}
