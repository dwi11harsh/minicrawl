import * as cheerio from 'cheerio';

const tagsForExclusion = [
	'header',
	'footer',
	'nav',
	'aside',
	'.header',
	'.top',
	'.navbar',
	'#header',
	'.footer',
	'.bottom',
	'#footer',
	'.sidebar',
	'.side',
	'.aside',
	'#sidebar',
	'.modal',
	'.popup',
	'#modal',
	'.overlay',
	'.ad',
	'.ads',
	'.advert',
	'#ad',
	'.lang-selector',
	'.language',
	'#language-selector',
	'.social',
	'.social-media',
	'.social-links',
	'#social',
	'.menu',
	'.navigation',
	'#nav',
	'.breadcrumbs',
	'#breadcrumbs',
	'.share',
	'#share',
	'.widget',
	'#widget',
	'.cookie',
	'#cookie',
];

const forceIncludeMainTags = ['#main'];

export const cleanHtml = (rawHtml: string, baseUrl: string) => {
	const doc = cheerio.load(rawHtml);

	// remove unwanted elmts
	doc('script, style, noscript, meta, head').remove();

	tagsForExclusion.forEach(tag => {
		const elmtsToRemove = doc(tag).filter(
			forceIncludeMainTags.map(x => ':not(:has(' + x + '))').join(''),
		);

		elmtsToRemove.remove();
	});

	const cleanedHtml = doc.html();
	return cleanedHtml;
};
