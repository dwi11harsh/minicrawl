import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import {
	htmlEventHandlersStringNoBrackets,
	htmlEventHandlersStringWithBrackets,
} from './htmlEventHandlers';

export const checkValidUrl = (url: string | undefined): boolean => {
	if (url) {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	} else {
		return false;
	}
};

export const whichToRemove = ({
	keepTags,
	removeTags,
	alwaysRemove,
}: {
	keepTags: string[];
	removeTags: string[];
	alwaysRemove: string[];
}): string[] => {
	let toRemove: string[] = [];

	if (keepTags.length > 0) {
		removeTags = removeTags.filter(tag => !keepTags.includes(tag));
		alwaysRemove = alwaysRemove.filter(tag => !keepTags.includes(tag));
	}

	toRemove = [...removeTags, ...alwaysRemove];
	toRemove = Array.from(new Set(toRemove));

	return toRemove;
};

export const removeTags = ({
	$,
	keepTags,
	removeTags,
}: {
	$: cheerio.CheerioAPI;
	keepTags?: string[];
	removeTags?: string[];
}) => {
	if (keepTags && keepTags.length > 0) {
		$('*')
			.contents()
			.filter(function () {
				return keepTags.includes(this.type);
			})
			.remove();
		return $;
	}

	if (removeTags && removeTags.length > 0) {
	}
	return $;
};

export const sanitizeAttributes = ($: cheerio.CheerioAPI) => {
	// attributes to remove
	const dangerousSchemes: string[] = ['javascript:', 'data:', 'vbscript:'];

	$('*').each(function () {
		if (
			this.type !== 'tag' &&
			this.type !== 'script' &&
			this.type !== 'style'
		)
			return; // narrow down to Element
		const el = this as Element;
		const $el = $(el);
		const attribs = el.attribs; // safe to access now

		// check all attributes of this element
		Object.keys(attribs || {}).forEach(attrName => {
			const attrValue = $el.attr(attrName);

			if (attrValue) {
				// Check if attribute contains any dangerous scheme
				const hasDangerousScheme = dangerousSchemes.some(scheme =>
					attrValue.toLowerCase().includes(scheme),
				);

				if (hasDangerousScheme) {
					// Remove the entire attribute
					$el.removeAttr(attrName);
				}
			}
		});
	});

	// remove event handlers
	$(htmlEventHandlersStringWithBrackets).removeAttr(
		htmlEventHandlersStringNoBrackets,
	);

	return $;
};
