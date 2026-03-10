import type { CleanHtmlOptions } from '@repo/types';
import * as cheerio from 'cheerio';
import { checkValidUrl, removeTags, whichToRemove } from './utils';

class HtmlOps {
	private $: cheerio.CheerioAPI;
	private baseUrl: URL; // this will be detected from <base> later
	private ops: CleanHtmlOptions;

	// these tags are to be always removed
	private alwaysRemove: string[] = [
		'script',
		'style',
		'noscript',
		'xml',
		'comment',
		'doctype',
	];

	// attributes to remove
	private dangerousSchemes: string[] = ['javascript:', 'data:', 'vbscript:'];

	constructor(rawHtml: string, options: CleanHtmlOptions) {
		this.$ = cheerio.load(rawHtml, {
			baseURI: options.baseUrl,
		});
		this.baseUrl = new URL(options.baseUrl);
		this.ops = options;
	}

	public clean = () => {
		const baseUrl = this._resolveBaseUrl();
		if (baseUrl) {
			this.baseUrl = new URL(baseUrl);
		}

		this._removeUnwanted();

		// remove malicious schemes and event handlers
	};

	public _resolveBaseUrl = () => {
		// <base `href`>
		const baseHref = this.$('base').attr('href');
		if (checkValidUrl(baseHref)) return baseHref;

		// <meta property="og:url" `content`>
		const metaHref = this.$('meta[property="og:url"]').attr('content');
		if (checkValidUrl(metaHref)) return metaHref;

		// baseUrl
		return this.baseUrl;
	};

	public _removeUnwanted = () => {
		// if keepOnly
		if (this.ops.keepOnlyTags && this.ops.keepOnlyTags.length > 0) {
			this.$ = removeTags({
				$: this.$,
				keepTags: this.ops.keepOnlyTags,
			});
			return;
		}

		const tagsToRemove: string[] = whichToRemove({
			keepTags: this.ops.keepTags,
			removeTags: this.ops.removeTags,
			alwaysRemove: this.alwaysRemove,
		});

		this.$ = removeTags({
			$: this.$,
			removeTags: tagsToRemove,
		});
		return;
	};
}

export const sanitize = ($: cheerio.CheerioAPI) => {
	$('*').each(function () {
		const $el = $(this);
	});
};
