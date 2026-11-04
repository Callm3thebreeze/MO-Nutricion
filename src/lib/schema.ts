import { contactInfo, training } from './content';
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from './seo';

type Site = URL | string | undefined;

const ref = (site: Site, id: string) => ({ '@id': absoluteUrl(`/#${id}`, site) });

const areaServed = [
	{ '@type': 'City', name: 'Albacete' },
	{ '@type': 'Country', name: 'España' },
];

// Grafo común a todas las páginas: negocio, profesional y sitio.
// Sin teléfono ni dirección exacta hasta que la clienta los confirme.
export const siteGraph = (site: Site, logo: string) => ({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': ['MedicalBusiness', 'LocalBusiness'],
			...ref(site, 'business'),
			name: SITE_NAME,
			url: absoluteUrl('/', site),
			description: SITE_DESCRIPTION,
			image: absoluteUrl(logo, site),
			logo: absoluteUrl(logo, site),
			medicalSpecialty: 'DietNutrition',
			email: contactInfo.email,
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Albacete',
				addressRegion: 'Castilla-La Mancha',
				addressCountry: 'ES',
			},
			areaServed,
			availableLanguage: 'es',
			priceRange: '55-200 EUR',
			founder: ref(site, 'mara'),
			openingHoursSpecification: [
				{ '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '17:30', closes: '20:30', description: 'Consulta presencial en Albacete' },
				{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Thursday'], opens: '16:00', closes: '19:00', description: 'Consulta online' },
			],
		},
		{
			'@type': 'Person',
			...ref(site, 'mara'),
			name: 'Mara Olivares',
			url: absoluteUrl('/sobre-mi', site),
			jobTitle: 'Dietista-nutricionista',
			worksFor: ref(site, 'business'),
			alumniOf: [
				{ '@type': 'CollegeOrUniversity', name: 'Universidad CEU San Pablo' },
				{ '@type': 'CollegeOrUniversity', name: 'Universidad de Alcalá' },
			],
			hasCredential: training.academic.map((item) => ({
				'@type': 'EducationalOccupationalCredential',
				credentialCategory: 'degree',
				name: item.split(' · ')[0],
			})),
			knowsAbout: ['Nutrición Humana y Dietética', 'Salud hormonal femenina', 'Fertilidad', 'Microbiota', 'Salud digestiva', 'Salud metabólica'],
		},
		{
			'@type': 'WebSite',
			...ref(site, 'website'),
			url: absoluteUrl('/', site),
			name: SITE_NAME,
			inLanguage: 'es-ES',
			publisher: ref(site, 'business'),
		},
	],
});

export const breadcrumb = (site: Site, trail: Array<[name: string, path: string]>) => ({
	'@type': 'BreadcrumbList',
	itemListElement: trail.map(([name, path], index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name,
		item: absoluteUrl(path, site),
	})),
});

export const areaGraph = (site: Site, name: string, path: string, description: string) => ({
	'@context': 'https://schema.org',
	'@graph': [
		breadcrumb(site, [['Inicio', '/'], ['Áreas', '/servicios'], [name, path]]),
		{
			'@type': 'Service',
			'@id': `${absoluteUrl(path, site)}#service`,
			name,
			serviceType: 'Consulta de nutrición clínica',
			description,
			url: absoluteUrl(path, site),
			provider: ref(site, 'business'),
			areaServed,
		},
	],
});

export const feesGraph = (site: Site, fees: Array<{ name: string; price: string; description: string }>) => ({
	'@context': 'https://schema.org',
	'@type': 'Service',
	'@id': `${absoluteUrl('/consultas', site)}#service`,
	name: 'Consultas de nutrición',
	provider: ref(site, 'business'),
	url: absoluteUrl('/consultas', site),
	hasOfferCatalog: {
		'@type': 'OfferCatalog',
		name: 'Consultas y tarifas',
		itemListElement: fees
			.map((fee) => ({ ...fee, amount: fee.price.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(',', '.') }))
			.filter((fee) => fee.amount)
			.map((fee) => ({
				'@type': 'Offer',
				name: fee.name,
				price: fee.amount,
				priceCurrency: 'EUR',
				url: absoluteUrl('/consultas', site),
				itemOffered: { '@type': 'Service', name: fee.name, description: fee.description },
			})),
	},
});
