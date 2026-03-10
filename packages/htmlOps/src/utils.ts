import * as cheerio from 'cheerio';

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
