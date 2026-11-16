import { PERSON_ID, PERSON_INSTAGRAM, PERSON_LINKEDIN, SITE_TITLE } from '../consts';

export const PERSON_PROFILE = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: SITE_TITLE,
	url: 'https://jackmaguire.org/about/',
	image: 'https://jackmaguire.org/images/about/jack-professional-portrait.jpg',
	description: 'Creative Intelligence Lead at NewForm in New York City. Writes about NYC food, travel, philosophy, AI, and work.',
	jobTitle: 'Creative Intelligence Lead',
	worksFor: { '@type': 'Organization', name: 'NewForm' },
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'New York',
		addressRegion: 'NY',
		addressCountry: 'US',
	},
	alumniOf: { '@type': 'CollegeOrUniversity', name: 'McGill University' },
	knowsAbout: [
		'Paid social media',
		'Meta Conversions API',
		'Meta Pixel implementation',
		'Conversion measurement',
		'Creative testing',
	],
	sameAs: [PERSON_LINKEDIN, PERSON_INSTAGRAM],
};

export const ARTICLE_AUTHOR = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: SITE_TITLE,
	url: 'https://jackmaguire.org/about/',
};
