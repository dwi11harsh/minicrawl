import type { CleanHtmlOptions } from '@mc/types';
import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';

class HTMLOps {
	private ch: cheerio.CheerioAPI;
	private baseUrl: URL;
	private options: CleanHtmlOptions;

	// these tags are to be always removed
	private alwaysRemove: string[] = [
		'script',
		'style',
		'noscript',
		'comment',
		'xml',
		'doctype',
	];

	constructor(rawHtml: string, options: CleanHtmlOptions) {
		this.ch = cheerio.load(rawHtml, {
			baseURI: options.baseUrl,
		});
		this.baseUrl = new URL(options.baseUrl);
		this.options = options;
	}

	/**
	 * Extract base href from <base>
	 * coz
	 * If a page contains <base href="https://something"> then all relative URLs should be resolved against that
	 */
	private _resolveBaseHref = () => {
		const baseTag = this.ch('base[href]').first();

		if (baseTag.length) {
			const baseHref = baseTag.attr('href');
			try {
				if (baseHref) {
					this.baseUrl = new URL(baseHref, this.baseUrl);
				} else {
					// do nothing
				}
			} catch (err) {
				// ignore invalid base
			}
		}
	};

	/**
	 * remove tags that pose the security problem which are in `alwaysRemove` array
	 */
	private _removeUnwantedTags = () => {
		this.ch = _removeCommentsAndDeclarations(this.ch);

		// if keepOnly tags are given, none other filters will be applied
		if (this.options.keepOnlyTags && this.options.keepOnlyTags.length > 0) {
			this.ch = _keepOnly(this.ch, this.options.keepOnlyTags);
			return;
		}

		// normalize keepTags for comparison
		const normalizedKeepTags =
			this.options.keepTags?.map(el => el.toLowerCase()) ?? [];

		// elements to remove (from user input and alwaysRemove array)
		const removeArray = [
			...new Set([
				...this.alwaysRemove,
				...(Array.isArray(this.options.removeTags)
					? this.options.removeTags
					: []),
			]),
		];

		// exclude tags the user explicitly wants to keep
		const finalRemoveTags = removeArray.filter(
			tag => !normalizedKeepTags.includes(tag.toLowerCase()),
		);

		this.ch = _removeTags(this.ch, finalRemoveTags);
	};

	/**
	 * Removes event handlers & javascript: URLs
	 */
	private _sanitizeAttributes() {
		const $ = this.ch;
		const dangerousSchemes = ['javascript:', 'data:', 'vbscript:'];
		const urlAttributes = ['href', 'src', 'poster', 'action', 'formaction'];

		// 1. Remove all event handler attributes (any attribute starting with "on")
		$('*').each((_, el) => {
			// Only process element nodes (tags)
			if (el.type !== 'tag') return;

			// get all attribute names
			const attribs = $(el).prop('attribs') as
				| Record<string, string>
				| undefined;

			if (!attribs) return;

			Object.keys(attribs).forEach(attr => {
				// all event listener starts with 'on', remove them
				if (attr.toLowerCase().startsWith('on')) {
					$(el).removeAttr(attr);
				}
			});
		});

		// 2. Remove dangerous URL schemes from specific attributes
		urlAttributes.forEach(attr => {
			$(`[${attr}]`).each((_, el) => {
				const value = $(el).attr(attr);
				if (
					value &&
					dangerousSchemes.some(scheme =>
						value.trim().toLowerCase().startsWith(scheme),
					)
				) {
					$(el).removeAttr(attr);
				}
			});
		});

		// 3. Remove inline styles as well
		$('[style]').removeAttr('style');
	}

	/**
	 * Resolves relative URLs in href, src and srcset
	 */
	private _resolveUrls() {
		const resolve = (url: string): string => {
			try {
				return new URL(url, this.baseUrl).toString();
			} catch {
				// keep original if invalid
				return url;
			}
		};

		this.ch('[href], [src], [poster]').each((_, el) => {
			const relativeUrl = this.ch(el).attr('href');
		});
	}
}

const _removeCommentsAndDeclarations = (
	$: cheerio.CheerioAPI,
): cheerio.CheerioAPI => {
	$('*')
		.contents()
		.each(function () {
			if (
				this.type.toLowerCase() === 'comment' ||
				this.type === 'directive'
			) {
				$(this).remove();
			}
		});
	return $;
};

/**
 * Removes all other tags which are not in the provided array
 * @param $
 * @param keepOnlyTags : array of tags to be preserved
 *
 * @returns cheerio.CheerioAPI
 */
const _keepOnly = (
	$: cheerio.CheerioAPI,
	keepOnlyTags: string[],
): cheerio.CheerioAPI => {
	const normalizedTags = keepOnlyTags.map(tag => tag.toLowerCase());

	// Collect elements to remove first, then remove in batch
	// to avoid DOM mutation side-effects during traversal
	const toRemove: cheerio.Cheerio<AnyNode>[] = [];

	$('*').each(function () {
		if (this.type.toLowerCase() === 'tag') {
			const el = this as Element;
			if (!normalizedTags.includes(el.name.toLowerCase())) {
				toRemove.push($(this));
			}
		}
	});

	toRemove.forEach(el => el.remove());

	return $;
};

const _removeTags = (
	$: cheerio.CheerioAPI,
	tagsToRemove: string[],
): cheerio.CheerioAPI => {
	const tagsNormalized = tagsToRemove.map(t => t.toLowerCase());

	const toRemove: cheerio.Cheerio<AnyNode>[] = [];

	$('*').each(function () {
		if (this.type === 'tag') {
			const el = this as Element;
			if (tagsNormalized.includes(el.name.toLowerCase())) {
				toRemove.push($(this));
			}
		}
	});

	toRemove.forEach(el => el.remove());

	return $;
};
