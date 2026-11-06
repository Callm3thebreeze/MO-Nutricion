// Modelo de contenidos editables en EmDash: colecciones, campos y textos por defecto.
// Los textos por defecto sirven a la vez de contenido inicial (seed) y de respaldo si EmDash falla.
//
// Formato de los campos de texto:
//   *texto*   → acento en cursiva serif
//   **texto** → negrita
//   ~texto~   → tono suave
//   Una línea en blanco separa párrafos; en las listas, un elemento por línea.

import {
	areas,
	consultations,
	contactInfo,
	faqs,
	healthIndicators,
	methodPhases,
	packConditions,
	processAssessment,
	schedule,
	training,
} from '../lib/content.ts';

type FieldType = 'string' | 'text' | 'boolean' | 'integer' | 'repeater';

export interface ModelField {
	slug: string;
	label: string;
	type: FieldType;
	subFields?: { slug: string; label: string; type: 'string' | 'text' | 'boolean' }[];
}

export interface ModelCollection {
	slug: string;
	label: string;
	labelSingular: string;
	description: string;
	titleField: string;
	sortOrder: number;
	urlPattern?: string;
	fields: ModelField[];
	/** Entradas iniciales: slug → datos */
	entries: Record<string, Record<string, unknown>>;
}

const FORMAT_HELP =
	'Formato: *texto* = cursiva destacada, **texto** = negrita, ~texto~ = tono suave. Deja una línea en blanco entre párrafos y, en las listas, escribe un elemento por línea.';

const str = (slug: string, label: string): ModelField => ({ slug, label, type: 'string' });
const txt = (slug: string, label: string): ModelField => ({ slug, label, type: 'text' });
const bool = (slug: string, label: string): ModelField => ({ slug, label, type: 'boolean' });
const int = (slug: string, label: string): ModelField => ({ slug, label, type: 'integer' });
const list = (slug: string, label: string, subFields: ModelField['subFields']): ModelField => ({
	slug,
	label,
	type: 'repeater',
	subFields,
});

const meta = [txt('meta_titulo', 'SEO · Título de la página'), txt('meta_descripcion', 'SEO · Descripción')];
const cta = (withSecondary = true) => [
	txt('cta_titulo', 'Llamada final · Título'),
	txt('cta_texto', 'Llamada final · Texto'),
	str('cta_boton', 'Llamada final · Botón principal'),
	...(withSecondary ? [str('cta_boton_2', 'Llamada final · Botón secundario')] : []),
];

const paragraphs = (items: string[]): string => items.join('\n\n');
const lines = (items: string[]): string => items.join('\n');

export const PAGE_GROUP = 'Páginas';

export const collections: ModelCollection[] = [
	{
		slug: 'pagina_inicio',
		label: 'Inicio',
		labelSingular: 'Inicio',
		description: FORMAT_HELP,
		titleField: 'hero_titulo',
		sortOrder: 1,
		fields: [
			...meta,
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			str('hero_boton_1', 'Portada · Botón principal'),
			str('hero_boton_2', 'Portada · Botón secundario'),
			txt('intro_texto', 'Introducción · Texto'),
			txt('areas_titulo', 'Áreas · Título'),
			txt('areas_texto', 'Áreas · Texto'),
			str('areas_publico', 'Áreas · Etiqueta «para hombres y mujeres»'),
			str('areas_enlace', 'Áreas · Texto del enlace'),
			str('areas_mas', 'Áreas · Texto tras los motivos de consulta'),
			str('enfoque_etiqueta', 'Enfoque · Etiqueta'),
			txt('enfoque_titulo', 'Enfoque · Frase destacada'),
			txt('enfoque_texto', 'Enfoque · Párrafos'),
			txt('indicadores_titulo', 'Indicadores · Título'),
			txt('indicadores_texto', 'Indicadores · Texto'),
			list('indicadores', 'Indicadores · Lista', [
				{ slug: 'titulo', label: 'Título', type: 'string' },
				{ slug: 'descripcion', label: 'Descripción', type: 'text' },
			]),
			txt('indicadores_cierre', 'Indicadores · Frase final'),
			str('sobre_mi_etiqueta', 'Sobre mí · Etiqueta'),
			txt('sobre_mi_titulo', 'Sobre mí · Título'),
			txt('sobre_mi_subtitulo', 'Sobre mí · Subtítulo'),
			txt('sobre_mi_texto', 'Sobre mí · Párrafos'),
			str('sobre_mi_boton', 'Sobre mí · Botón'),
			...cta(false),
		],
		entries: {
			inicio: {
				meta_titulo: 'Nutrición integrativa: salud hormonal, digestiva y metabólica',
				meta_descripcion:
					'Consulta de nutrición clínica e integrativa con rigor científico. Salud hormonal y fertilidad en la mujer, microbiota y salud digestiva, y salud metabólica. Online y presencial en Albacete.',
				hero_titulo: 'Nutrición real ~para una~ *vida* *mejor*',
				hero_subtitulo:
					'Te acompaño a construir hábitos saludables que se adapten a ti, con ciencia, empatía y **resultados duraderos**.',
				hero_boton_1: 'Conoce mi método de trabajo',
				hero_boton_2: 'Reserva tu consulta',
				intro_texto:
					'~Una consulta de nutrición clínica e integrativa en la que~ cada persona se aborda de forma individualizada.',
				areas_titulo: 'Áreas de *especialización*',
				areas_texto:
					'La nutrición interviene en numerosos procesos del organismo. Por eso, cada consulta comienza por comprender qué necesitas y cuáles son los factores que pueden estar influyendo en tu salud. Mi trabajo se centra en tres áreas principales.',
				areas_publico: 'Para hombres y mujeres',
				areas_enlace: 'Descubre esta área',
				areas_mas: 'entre otros motivos de consulta',
				enfoque_etiqueta: 'Más allá de una dieta',
				enfoque_titulo: 'No existen dos personas iguales. *Tampoco dos planes nutricionales iguales.*',
				enfoque_texto: paragraphs([
					'**No entiendo** la nutrición como una lista de alimentos permitidos y prohibidos ni como un conjunto de pautas que debas seguir de forma indefinida.',
					'**Entiendo** la nutrición como una herramienta para cuidar la salud, cubrir las necesidades del organismo y mejorar la relación con la alimentación.',
					'Por eso, antes de establecer cualquier estrategia nutricional, necesito conocer tu historia, comprender qué está ocurriendo y valorar cuáles son tus necesidades reales.',
					'Cada propuesta se construye desde cero, teniendo en cuenta tus circunstancias, preferencias, síntomas, objetivos y respuesta individual.',
				]),
				indicadores_titulo: 'Tu salud no se define por un *único parámetro*',
				indicadores_texto:
					'Una analítica aporta información muy valiosa, pero no cuenta por sí sola toda la historia. Durante el proceso también prestamos atención a otros indicadores que nos ayudan a valorar tu evolución.',
				indicadores: healthIndicators.map((item) => ({ titulo: item.title, descripcion: item.description })),
				indicadores_cierre:
					'La evolución no se mide únicamente en resultados analíticos, sino también en *cómo te encuentras* y en los cambios que consigues mantener.',
				sobre_mi_etiqueta: 'Sobre mí',
				sobre_mi_titulo: 'Mara *Olivares*',
				sobre_mi_subtitulo: 'Farmacéutica, biotecnóloga y dietista-nutricionista.',
				sobre_mi_texto: paragraphs([
					'Mi formación en Farmacia, Biotecnología y Nutrición Humana y Dietética me ha permitido desarrollar una visión amplia de los procesos que intervienen en la salud.',
					'Mi interés profesional se centra especialmente en la relación entre nutrición, salud hormonal femenina, microbiota, sistema digestivo y metabolismo.',
					'Entiendo la práctica nutricional como un proceso de evaluación, aprendizaje y acompañamiento. Me interesa comprender qué hay detrás de cada caso, interpretar la información disponible y trasladar el conocimiento científico a estrategias nutricionales útiles y aplicables a la vida real.',
					'Por eso, cada consulta parte de una valoración individual y de un trabajo conjunto, con seguimiento y adaptación a lo largo del tiempo.',
				]),
				sobre_mi_boton: 'Conoce mi formación y trayectoria',
				cta_titulo: 'Cada proceso empieza por *comprender tus necesidades*',
				cta_texto:
					'Si quieres mejorar tu alimentación, comprender mejor tus síntomas o trabajar sobre algún aspecto de tu salud, podemos empezar por una valoración individualizada.',
				cta_boton: 'Reserva tu primera consulta',
			},
		},
	},
	{
		slug: 'pagina_sobre_mi',
		label: 'Sobre mí',
		labelSingular: 'Sobre mí',
		description: FORMAT_HELP,
		titleField: 'hero_titulo',
		sortOrder: 2,
		fields: [
			...meta,
			str('hero_etiqueta', 'Portada · Etiqueta'),
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			txt('hero_texto', 'Portada · Párrafos'),
			str('forma_etiqueta', 'Forma de trabajar · Título'),
			txt('forma_destacado', 'Forma de trabajar · Frase destacada'),
			txt('forma_texto', 'Forma de trabajar · Párrafos'),
			str('formacion_etiqueta', 'Formación · Título'),
			str('formacion_academica_titulo', 'Formación académica · Título'),
			txt('formacion_academica', 'Formación académica · Lista'),
			str('formacion_complementaria_titulo', 'Formación complementaria · Título'),
			txt('formacion_complementaria', 'Formación complementaria · Lista'),
			str('filosofia_etiqueta', 'Filosofía · Etiqueta'),
			txt('filosofia_titulo', 'Filosofía · Título'),
			txt('filosofia_texto', 'Filosofía · Párrafos'),
			...cta(),
		],
		entries: {
			'sobre-mi': {
				meta_titulo: 'Sobre mí',
				meta_descripcion:
					'Mara Olivares, farmacéutica, biotecnóloga y dietista-nutricionista. Formación, trayectoria y filosofía de trabajo.',
				hero_etiqueta: 'Sobre mí',
				hero_titulo: 'Mara *Olivares*',
				hero_subtitulo: 'Nutricionista integrativa',
				hero_texto: paragraphs([
					'Soy Mara Olivares, farmacéutica, biotecnóloga y dietista-nutricionista.',
					'Mi trayectoria académica y profesional me ha llevado a interesarme por la relación entre los diferentes sistemas del organismo y el papel que desempeña la nutrición en su funcionamiento.',
					'La formación en Farmacia y Biotecnología me aportó una base científica para comprender los procesos fisiológicos y bioquímicos que intervienen en la salud. Posteriormente, la Nutrición Humana y Dietética me permitió profundizar en la aplicación de ese conocimiento a la práctica clínica y al acompañamiento nutricional.',
					'Mi especial interés se centra en la salud hormonal femenina, la microbiota y la salud digestiva, así como en el metabolismo y su relación con el estado nutricional.',
				]),
				forma_etiqueta: 'Mi forma de trabajar',
				forma_destacado:
					'Considero que cada persona necesita algo diferente. Por eso, mi forma de trabajar se basa en *escuchar, valorar, comprender* y diseñar estrategias individualizadas.',
				forma_texto: paragraphs([
					'Siempre desde el rigor científico y con una visión global de la salud.',
					'Me gusta que cada persona entienda qué estamos trabajando, por qué lo hacemos y cómo puede aplicar los cambios a su día a día.',
				]),
				formacion_etiqueta: 'Formación',
				formacion_academica_titulo: 'Académica',
				formacion_academica: lines(training.academic),
				formacion_complementaria_titulo: 'Complementaria',
				formacion_complementaria: lines(training.complementary),
				filosofia_etiqueta: 'Filosofía de trabajo',
				filosofia_titulo: 'Ciencia para comprender. *Nutrición para acompañar.*',
				filosofia_texto: paragraphs([
					'La evidencia científica es el punto de partida de mi trabajo, pero la aplicación de sus recomendaciones debe adaptarse a la realidad de cada persona.',
					'No busco imponer pautas rígidas ni soluciones rápidas. Mi objetivo es ayudarte a comprender tus necesidades nutricionales y construir cambios que puedas integrar en tu vida cotidiana.',
				]),
				cta_titulo: 'Empecemos por conocer *tu caso*',
				cta_texto:
					'Cada proceso comienza con una valoración individualizada para conocer tus necesidades y establecer las prioridades de trabajo.',
				cta_boton: 'Reserva tu primera consulta',
				cta_boton_2: 'Cómo trabajo',
			},
		},
	},
	{
		slug: 'pagina_areas',
		label: 'Áreas (textos de página)',
		labelSingular: 'Áreas (textos de página)',
		description: `Textos del índice de áreas y de los rótulos comunes de cada área. ${FORMAT_HELP}`,
		titleField: 'hero_titulo',
		sortOrder: 3,
		fields: [
			...meta,
			str('hero_etiqueta', 'Portada · Etiqueta'),
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			str('motivos_titulo', 'Listado · Título de los motivos de consulta'),
			str('motivos_cierre', 'Listado · Último motivo («entre otros…»)'),
			str('enlace_texto', 'Listado · Texto del enlace'),
			str('publico_texto', 'Listado · Etiqueta «para hombres y mujeres»'),
			...cta(),
			str('detalle_volver', 'Página de área · Enlace para volver'),
			str('detalle_etiqueta', 'Página de área · Etiqueta (se añade el número)'),
			str('detalle_publico', 'Página de área · Aviso «para hombres y mujeres»'),
			str('detalle_enfoque_titulo', 'Página de área · Título del enfoque'),
			str('detalle_temas_titulo', 'Página de área · Título de los temas'),
			str('detalle_boton', 'Página de área · Botón final'),
			str('detalle_boton_2', 'Página de área · Botón de consultas y tarifas'),
		],
		entries: {
			areas: {
				meta_titulo: 'Áreas de especialización',
				meta_descripcion:
					'Áreas de especialización de Mara Olivares: salud hormonal y fertilidad en la mujer, microbiota y salud digestiva, y salud metabólica.',
				hero_etiqueta: 'Áreas de especialización',
				hero_titulo: 'Tres áreas, una misma *forma de trabajar*',
				hero_subtitulo:
					'Cada organismo tiene unas necesidades y cada situación requiere una valoración diferente. Mi consulta se estructura en tres áreas de especialización que permiten abordar la salud desde una perspectiva nutricional individualizada.',
				motivos_titulo: 'Algunos motivos de consulta',
				motivos_cierre: 'Entre otros motivos de consulta',
				enlace_texto: 'Descubre esta área',
				publico_texto: 'Para hombres y mujeres',
				cta_titulo: 'Cuéntame qué te está *pasando*',
				cta_texto: 'Valoramos tu caso en una primera consulta de 90 minutos, online o presencial en Albacete.',
				cta_boton: 'Reserva tu consulta',
				cta_boton_2: 'Consultas y tarifas',
				detalle_volver: 'Áreas de especialización',
				detalle_etiqueta: 'Área',
				detalle_publico: 'Esta área está dirigida tanto a hombres como a mujeres',
				detalle_enfoque_titulo: 'El enfoque',
				detalle_temas_titulo: '¿En qué podemos trabajar?',
				detalle_boton: 'Reserva tu consulta',
				detalle_boton_2: 'Consultas y tarifas',
			},
		},
	},
	{
		slug: 'areas',
		label: 'Áreas de especialización',
		labelSingular: 'Área de especialización',
		description: `Cada entrada es un área con su propia página en /servicios/{slug}. ${FORMAT_HELP}`,
		titleField: 'titulo',
		sortOrder: 4,
		urlPattern: '/servicios/{slug}',
		fields: [
			str('titulo', 'Título'),
			int('orden', 'Orden (1, 2, 3…)'),
			txt('resumen', 'Resumen (inicio y listado de áreas)'),
			txt('motivos', 'Motivos de consulta destacados (lista)'),
			txt('introduccion', 'Introducción (el primer párrafo va en la portada)'),
			list('temas', '¿En qué podemos trabajar?', [
				{ slug: 'titulo', label: 'Título', type: 'string' },
				{ slug: 'descripcion', label: 'Descripción', type: 'text' },
			]),
			str('extra_titulo', 'Bloque adicional · Título (opcional)'),
			txt('extra_texto', 'Bloque adicional · Párrafos (el primero se destaca)'),
			txt('cierre', 'Frase de cierre'),
			bool('para_todos', 'Dirigida a hombres y mujeres'),
		],
		entries: Object.fromEntries(
			areas.map((area, index) => [
				area.slug,
				{
					titulo: area.title,
					orden: index + 1,
					resumen: paragraphs(area.summary),
					motivos: lines(area.highlights),
					introduccion: paragraphs(area.intro),
					temas: area.topics.map((topic) => ({ titulo: topic.title, descripcion: topic.description })),
					extra_titulo: area.extra?.title ?? '',
					extra_texto: area.extra ? paragraphs(area.extra.paragraphs) : '',
					cierre: area.closing,
					para_todos: area.forEveryone,
				},
			]),
		),
	},
	{
		slug: 'pagina_como_trabajo',
		label: 'Cómo trabajo',
		labelSingular: 'Cómo trabajo',
		description: FORMAT_HELP,
		titleField: 'hero_titulo',
		sortOrder: 5,
		fields: [
			...meta,
			str('hero_etiqueta', 'Portada · Etiqueta'),
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			txt('hero_texto', 'Portada · Texto'),
			str('fase_etiqueta', 'Fases · Etiqueta (se añade el número)'),
			list('fases', 'Fases del método', [
				{ slug: 'titulo', label: 'Título', type: 'string' },
				{ slug: 'frase', label: 'Frase destacada', type: 'string' },
				{ slug: 'duracion', label: 'Duración (opcional)', type: 'string' },
				{ slug: 'texto', label: 'Párrafos', type: 'text' },
			]),
			str('valoramos_titulo', 'Qué valoramos · Título'),
			txt('valoramos', 'Qué valoramos · Lista'),
			txt('cierre_texto', 'Frase de cierre'),
			...cta(),
		],
		entries: {
			'como-trabajo': {
				meta_titulo: 'Cómo trabajo',
				meta_descripcion:
					'Un proceso individualizado, no una dieta estándar: valoración inicial, estrategia nutricional personalizada, seguimiento y consolidación de hábitos.',
				hero_etiqueta: 'Cómo trabajo',
				hero_titulo: 'Un proceso individualizado, *no una dieta estándar*',
				hero_subtitulo: 'Cada consulta comienza por conocer tu situación y comprender qué necesitas.',
				hero_texto:
					'No trabajo con menús cerrados ni con protocolos universales. Mi metodología parte de una valoración individualizada y se desarrolla mediante una estrategia nutricional que se adapta a tu evolución.',
				fase_etiqueta: 'Fase',
				fases: methodPhases.map((phase) => ({
					titulo: phase.title,
					frase: phase.lead,
					duracion: phase.duration ?? '',
					texto: paragraphs(phase.paragraphs),
				})),
				valoramos_titulo: 'Qué valoramos durante el proceso',
				valoramos: lines(processAssessment),
				cierre_texto:
					'Una buena estrategia nutricional no es la que más restricciones impone, sino la que *responde a tus necesidades* y puedes mantener en el tiempo.',
				cta_titulo: 'Empecemos por la *valoración inicial*',
				cta_texto: 'La primera consulta dura 90 minutos y se puede realizar online o de forma presencial en Albacete.',
				cta_boton: 'Reserva tu consulta',
				cta_boton_2: 'Consultas y tarifas',
			},
		},
	},
	{
		slug: 'pagina_consultas',
		label: 'Consultas y tarifas',
		labelSingular: 'Consultas y tarifas',
		description: FORMAT_HELP,
		titleField: 'hero_titulo',
		sortOrder: 6,
		fields: [
			...meta,
			str('hero_etiqueta', 'Portada · Etiqueta'),
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			str('incluye_titulo', 'Tarifas · Título de «Incluye»'),
			list('tarifas', 'Tarifas', [
				{ slug: 'titulo', label: 'Título', type: 'string' },
				{ slug: 'precio', label: 'Precio', type: 'string' },
				{ slug: 'detalle', label: 'Detalle (duración, ahorro…)', type: 'string' },
				{ slug: 'descripcion', label: 'Descripción', type: 'text' },
				{ slug: 'incluye', label: 'Incluye (un elemento por línea)', type: 'text' },
				{ slug: 'nota', label: 'Nota (opcional)', type: 'string' },
				{ slug: 'destacada', label: 'Destacada', type: 'boolean' },
			]),
			str('condiciones_titulo', 'Condiciones · Título'),
			txt('condiciones', 'Condiciones · Lista'),
			str('modalidades_titulo', 'Modalidades · Título'),
			list('modalidades', 'Modalidades', [
				{ slug: 'modalidad', label: 'Modalidad', type: 'string' },
				{ slug: 'dias', label: 'Días', type: 'string' },
				{ slug: 'horario', label: 'Horario', type: 'string' },
				{ slug: 'descripcion', label: 'Descripción', type: 'text' },
			]),
			...cta(),
		],
		entries: {
			consultas: {
				meta_titulo: 'Consultas y tarifas',
				meta_descripcion:
					'Primera consulta de 90 minutos, consultas de seguimiento y pack de acompañamiento nutricional. Online o presencial en Albacete.',
				hero_etiqueta: 'Consultas y tarifas',
				hero_titulo: 'Consultas *a tu medida*',
				hero_subtitulo:
					'Cada proceso comienza con una valoración individualizada para conocer tus necesidades y establecer las prioridades de trabajo.',
				incluye_titulo: 'Incluye',
				tarifas: consultations.map((item) => ({
					titulo: item.title,
					precio: item.price,
					detalle: item.detail,
					descripcion: item.description,
					incluye: lines(item.includes),
					nota: item.note ?? '',
					destacada: item.featured ?? false,
				})),
				condiciones_titulo: 'Condiciones del pack',
				condiciones: lines(packConditions),
				modalidades_titulo: 'Modalidades de consulta',
				modalidades: schedule.map((item) => ({
					modalidad: item.mode,
					dias: item.days,
					horario: item.time,
					descripcion: item.description,
				})),
				cta_titulo: 'Reserva tu *primera consulta*',
				cta_texto: '¿Tienes dudas antes de empezar? Revisa las preguntas frecuentes o escríbeme.',
				cta_boton: 'Reserva tu consulta',
				cta_boton_2: 'Preguntas frecuentes',
			},
		},
	},
	{
		slug: 'pagina_faq',
		label: 'Preguntas frecuentes',
		labelSingular: 'Preguntas frecuentes',
		description: FORMAT_HELP,
		titleField: 'hero_titulo',
		sortOrder: 7,
		fields: [
			...meta,
			str('hero_etiqueta', 'Portada · Etiqueta'),
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			str('hero_enlace', 'Portada · Enlace a contacto'),
			str('lista_titulo', 'Preguntas · Título'),
			list('preguntas', 'Preguntas', [
				{ slug: 'pregunta', label: 'Pregunta', type: 'string' },
				{ slug: 'respuesta', label: 'Respuesta', type: 'text' },
			]),
			txt('cta_titulo', 'Llamada final · Título'),
			str('cta_boton', 'Llamada final · Botón principal'),
			str('cta_boton_2', 'Llamada final · Botón secundario'),
		],
		entries: {
			'preguntas-frecuentes': {
				meta_titulo: 'Preguntas frecuentes',
				meta_descripcion:
					'Dudas habituales sobre las consultas de nutrición: analíticas, estrategia nutricional, consultas online, duración del proceso y reservas.',
				hero_etiqueta: 'Preguntas frecuentes',
				hero_titulo: 'Antes de *empezar*',
				hero_subtitulo: 'Las dudas más habituales sobre las consultas y el proceso de acompañamiento nutricional.',
				hero_enlace: '¿Otra pregunta? Escríbeme',
				lista_titulo: 'Dudas habituales',
				preguntas: faqs.map((faq) => ({ pregunta: faq.question, respuesta: faq.answer })),
				cta_titulo: 'Empecemos por conocer *tu caso*',
				cta_boton: 'Reserva tu consulta',
				cta_boton_2: 'Consultas y tarifas',
			},
		},
	},
	{
		slug: 'pagina_contacto',
		label: 'Contacto',
		labelSingular: 'Contacto',
		description: FORMAT_HELP,
		titleField: 'hero_titulo',
		sortOrder: 8,
		fields: [
			...meta,
			str('hero_etiqueta', 'Portada · Etiqueta'),
			txt('hero_titulo', 'Portada · Título'),
			txt('hero_subtitulo', 'Portada · Subtítulo'),
			txt('hero_texto', 'Portada · Texto'),
			str('tarifas_boton', 'Portada · Botón de precios y tarifas'),
			list('pasos', 'Pasos del proceso', [
				{ slug: 'titulo', label: 'Título', type: 'string' },
				{ slug: 'descripcion', label: 'Descripción', type: 'text' },
			]),
			list('horarios', 'Horarios', [
				{ slug: 'modalidad', label: 'Modalidad', type: 'string' },
				{ slug: 'horario', label: 'Horario', type: 'string' },
			]),
		],
		entries: {
			contacto: {
				meta_titulo: 'Contacto',
				meta_descripcion:
					'Reserva tu primera consulta de nutrición con Mara Olivares, online o presencial en Albacete.',
				hero_etiqueta: 'Contacto',
				hero_titulo: 'Empecemos por conocer *tu caso*',
				hero_subtitulo:
					'Si quieres comenzar un proceso de acompañamiento nutricional, puedes solicitar tu primera consulta presencial en Albacete u online.',
				hero_texto:
					'Cada proceso comienza con una valoración individualizada para conocer tus necesidades y establecer las prioridades de trabajo.',
				tarifas_boton: 'Ver precios y tarifas',
				pasos: [
					{
						titulo: 'Valoración individualizada',
						descripcion: 'Primera consulta de 90 minutos para entender tu caso de forma global.',
					},
					{
						titulo: 'Estrategia propia',
						descripcion: 'Sin dietas cerradas: una estrategia adaptada a tus necesidades y objetivos.',
					},
					{
						titulo: 'Seguimiento',
						descripcion: 'Consultas de hasta 60 minutos para valorar tu evolución y ajustar el plan.',
					},
				],
				horarios: [
					{ modalidad: 'Online', horario: 'Martes y jueves, de 16:00 a 19:00 h' },
					{ modalidad: 'Presencial en Albacete', horario: 'Miércoles, de 17:30 a 20:30 h' },
				],
			},
		},
	},
	{
		slug: 'datos_generales',
		label: 'Datos de contacto y pie',
		labelSingular: 'Datos de contacto y pie',
		description: 'Datos que aparecen en varias páginas: correo y textos del pie de página.',
		titleField: 'email',
		sortOrder: 9,
		fields: [
			str('email', 'Correo electrónico visible'),
			str('colegiada', 'Número de colegiada'),
			str('pie_online', 'Pie · Horario online'),
			str('pie_presencial', 'Pie · Horario presencial'),
		],
		entries: {
			general: {
				email: contactInfo.email,
				colegiada: contactInfo.license,
				pie_online: 'Online · martes y jueves',
				pie_presencial: 'Presencial en Albacete · miércoles',
			},
		},
	},
];

export const collectionBySlug = (slug: string): ModelCollection => {
	const collection = collections.find((item) => item.slug === slug);
	if (!collection) {
		throw new Error(`Colección desconocida: ${slug}`);
	}
	return collection;
};
