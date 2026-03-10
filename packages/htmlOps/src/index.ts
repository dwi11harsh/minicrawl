import type { CleanHtmlOptions, Metadata } from '@repo/types';
import * as cheerio from 'cheerio';
import {
	checkValidUrl,
	removeTags,
	sanitizeAttributes,
	whichToRemove,
} from './utils';

class HtmlOps {
	private $: cheerio.CheerioAPI;
	private baseUrl: URL; // this will be detected from <base> later
	private ops: CleanHtmlOptions;
	private cleanedHtml: string | null = null;
	private metadata: Metadata | null = null;
	private images: string[] | null = null;
	private urls: string[] | null = null;

	// these tags are to be always removed
	private alwaysRemove: string[] = [
		'script',
		'style',
		'noscript',
		'xml',
		'comment',
		'doctype',
	];

	constructor(rawHtml: string, options: CleanHtmlOptions) {
		this.$ = cheerio.load(rawHtml, {
			baseURI: options.baseUrl,
		});
		this.baseUrl = new URL(options.baseUrl);
		this.ops = options;
	}

	public clean = (): string => {
		const baseUrl = this._resolveBaseUrl();
		if (baseUrl) {
			this.baseUrl = new URL(baseUrl);
		}
		this._removeUnwanted();
		// remove malicious schemes and event handlers
		this.$ = sanitizeAttributes(this.$);
		this.cleanedHtml = this.$.html();

		return this.cleanedHtml;
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
