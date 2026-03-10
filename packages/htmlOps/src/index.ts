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
	public cleanedHtml: string | null = null;
	public metadata: Metadata | null = null;
	public images: string[] | null = null;
	public urls: string[] | null = null;

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

	public getMetadata = (): Metadata | null => {
		const metaTitle = this.$('meta[name="title"]').attr('content');
		const ogTitle = this.$('meta[property="og:title"]').attr('content');

		const ogDescription = this.$('meta[name="description"]').attr(
			'content',
		);
		const metaImages = this.$.extract({
			ogImage: {
				selector: 'meta[property="og:image"]',
				value: 'content',
			},
			twitterImage: {
				selector: 'meta[name="twitter:image"]',
				value: 'content',
			},
			ogImageSecure: {
				selector: 'meta[property="og:image:secure_url"]',
				value: 'content',
			},
			ogImageUrl: {
				selector: 'meta[property="og:image:url"]',
				value: 'content',
			},
			twitterImageSrc: {
				selector: 'meta[name="twitter:image:src"]',
				value: 'content',
			},
		});
		const lang = this.$('html').attr('lang')?.toString();

		const keywords = this.$('meta[name="keywords"]').attr('content');

		this.metadata = {
			title: metaTitle ? metaTitle : ogTitle,
			description: ogDescription,
			language: lang,
			keywords: keywords,
			images: metaImages,
		};
		return this.metadata;
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
