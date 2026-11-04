// Contenidos compartidos entre páginas (fuente: documento de contenidos web de la clienta)

export interface AreaTopic {
	title: string;
	description: string;
}

export interface Area {
	slug: string;
	title: string;
	/** Resumen para la home y el índice de áreas */
	summary: string[];
	/** Motivos de consulta resumidos para la home */
	highlights: string[];
	intro: string[];
	topics: AreaTopic[];
	closing: string;
	forEveryone: boolean;
	extra?: { title: string; paragraphs: string[] };
}

export const areas: Area[] = [
	{
		slug: 'salud-hormonal',
		title: 'Salud hormonal y fertilidad en la mujer',
		summary: [
			'La salud hormonal femenina cambia a lo largo de las distintas etapas de la vida. Comprender el ciclo menstrual, identificar los factores que influyen en sus síntomas y cuidar el estado nutricional son aspectos fundamentales de este proceso.',
		],
		highlights: [
			'Alteraciones del ciclo menstrual',
			'Síndrome premenstrual',
			'Endometriosis y adenomiosis',
			'Síndrome de ovario poliquístico',
			'Búsqueda de embarazo y salud reproductiva',
		],
		intro: [
			'La salud hormonal femenina está relacionada con numerosos procesos fisiológicos que cambian a lo largo de la vida.',
			'El ciclo menstrual, la función ovárica, el metabolismo y la salud reproductiva están influidos por diferentes factores, entre ellos el estado nutricional y los hábitos de vida.',
			'El abordaje nutricional busca acompañar estos procesos, mejorar la calidad de la alimentación y atender las necesidades específicas de cada etapa, desde el conocimiento de la fisiología y el rigor científico.',
		],
		topics: [
			{
				title: 'Ciclo menstrual y salud hormonal',
				description:
					'Comprender el ciclo menstrual es una parte importante del cuidado de la salud femenina. Trabajamos la educación menstrual, el conocimiento de las fases del ciclo y la identificación de patrones y síntomas.',
			},
			{
				title: 'Síndrome premenstrual y molestias menstruales',
				description:
					'Valoración de los hábitos alimentarios, el estado nutricional y otros factores que pueden influir en la sintomatología asociada al ciclo.',
			},
			{
				title: 'Endometriosis y adenomiosis',
				description:
					'Acompañamiento nutricional individualizado para atender las necesidades nutricionales, la salud digestiva y el bienestar general de mujeres con diagnóstico de endometriosis o adenomiosis.',
			},
			{
				title: 'Síndrome de ovario poliquístico (SOP)',
				description:
					'Abordaje nutricional adaptado a las características de cada mujer, prestando especial atención a la salud metabólica, la sensibilidad a la insulina cuando corresponda y la calidad global de la alimentación.',
			},
			{
				title: 'Alteraciones del ciclo menstrual',
				description:
					'Valoración nutricional y de hábitos ante irregularidades menstruales y otros cambios del ciclo, en coordinación con el seguimiento ginecológico cuando sea necesario.',
			},
			{
				title: 'Fertilidad y preparación preconcepcional',
				description:
					'La etapa previa a la búsqueda de embarazo es una oportunidad para revisar el estado nutricional, los hábitos y la suficiencia de nutrientes importantes para la salud reproductiva.',
			},
			{
				title: 'Reproducción asistida',
				description:
					'Acompañamiento nutricional durante los procesos de reproducción asistida, atendiendo las necesidades de cada etapa y coordinando el trabajo con el equipo sanitario correspondiente.',
			},
			{
				title: 'Perimenopausia y menopausia',
				description:
					'Adaptación de la alimentación y los hábitos a los cambios fisiológicos de esta etapa, prestando atención a la salud metabólica, ósea, muscular y cardiovascular.',
			},
		],
		extra: {
			title: 'Educación menstrual y conocimiento de la fertilidad',
			paragraphs: [
				'Conocer el ciclo menstrual permite comprender mejor los cambios fisiológicos que se producen a lo largo del mes.',
				'La educación menstrual y el conocimiento de los signos de fertilidad pueden ayudar a interpretar el ciclo y reconocer los patrones individuales.',
				'Se contempla el acompañamiento en educación del ciclo y método sintotérmico dentro del ámbito de formación y competencia profesional correspondiente.',
			],
		},
		closing:
			'Cada mujer tiene una historia, unas necesidades y una etapa vital diferente. El objetivo es ofrecer un acompañamiento nutricional adaptado a esa realidad, sin recurrir a protocolos generalizados.',
		forEveryone: false,
	},
	{
		slug: 'salud-digestiva',
		title: 'Microbiota y salud digestiva',
		summary: [
			'La salud digestiva influye en cómo nos sentimos, en nuestra alimentación y en numerosos procesos fisiológicos.',
			'Abordamos las alteraciones digestivas desde una valoración individualizada, teniendo en cuenta la sintomatología, los hábitos alimentarios, la tolerancia a los alimentos y el contexto clínico de cada persona.',
		],
		highlights: [
			'SIBO y alteraciones de la microbiota',
			'Hinchazón abdominal y gases',
			'Estreñimiento y diarrea',
			'Síndrome del intestino irritable',
			'Dificultades de tolerancia alimentaria',
		],
		intro: [
			'La salud digestiva es mucho más que hacer una buena digestión.',
			'El aparato digestivo participa en la digestión y absorción de nutrientes, en la interacción con la microbiota intestinal y en diferentes procesos relacionados con el funcionamiento del organismo.',
			'Cuando aparecen molestias digestivas persistentes o dificultades para tolerar determinados alimentos, es importante valorar el contexto completo y no limitarse a eliminar alimentos de forma indefinida.',
			'El objetivo es desarrollar una estrategia nutricional individualizada que permita mejorar el bienestar digestivo y favorecer una alimentación lo más completa y variada posible, dentro de las necesidades y tolerancias de cada persona.',
		],
		topics: [
			{
				title: 'Microbiota intestinal y disbiosis',
				description:
					'Valoración de la alimentación, los hábitos y los antecedentes relacionados con la salud intestinal. Acompañamiento nutricional cuando existen alteraciones de la microbiota.',
			},
			{
				title: 'SIBO y sobrecrecimiento bacteriano',
				description:
					'Abordaje nutricional individualizado en personas con diagnóstico de SIBO, teniendo en cuenta la sintomatología, la tolerancia alimentaria y el contexto clínico.',
			},
			{
				title: 'Hinchazón abdominal y gases',
				description:
					'Valoración de los hábitos alimentarios, la composición de la dieta, el ritmo de las comidas y otros factores relacionados con la sintomatología digestiva.',
			},
			{
				title: 'Síndrome del intestino irritable',
				description:
					'Estrategias nutricionales adaptadas a los síntomas y a la tolerancia individual, evitando restricciones innecesarias y trabajando, cuando sea posible, hacia una alimentación suficiente y variada.',
			},
			{
				title: 'Estreñimiento y diarrea',
				description:
					'Valoración de la ingesta de fibra, hidratación, hábitos, composición de la alimentación y otros factores que pueden influir en el tránsito intestinal.',
			},
			{
				title: 'Reflujo y molestias digestivas altas',
				description:
					'Adaptación de la alimentación y de determinados hábitos para atender las necesidades individuales y favorecer el bienestar digestivo.',
			},
			{
				title: 'Intolerancias y sensibilidad alimentaria',
				description:
					'Valoración de las dificultades de tolerancia, la calidad nutricional de la dieta y las posibilidades de reintroducción o diversificación cuando estén indicadas.',
			},
			{
				title: 'Sensibilidad a la histamina',
				description:
					'Acompañamiento nutricional en personas con sospecha o diagnóstico de intolerancia a la histamina, prestando especial atención a evitar restricciones excesivas y déficits nutricionales.',
			},
		],
		closing:
			'No se trata de retirar cada vez más alimentos, sino de comprender qué puede estar ocurriendo y trabajar para mejorar la tolerancia, la calidad de la alimentación y el bienestar digestivo.',
		forEveryone: true,
	},
	{
		slug: 'salud-metabolica',
		title: 'Salud metabólica',
		summary: [
			'El metabolismo está relacionado con la forma en la que el organismo obtiene, utiliza y almacena la energía y los nutrientes.',
			'El abordaje nutricional busca mejorar la salud metabólica y el estado nutricional mediante estrategias adaptadas a cada persona, sin reducir el proceso a contar calorías o perder peso.',
		],
		highlights: [
			'Resistencia a la insulina',
			'Alteraciones de glucosa y colesterol',
			'Hígado graso',
			'Composición corporal',
			'Sobrepeso y obesidad',
		],
		intro: [
			'El metabolismo engloba los procesos mediante los cuales el organismo obtiene, transforma y utiliza la energía y los nutrientes.',
			'La alimentación, la actividad física, el descanso, la composición corporal y otros factores influyen en la salud metabólica.',
			'El abordaje nutricional se centra en mejorar la calidad de la alimentación, cubrir las necesidades del organismo y trabajar sobre los factores modificables relacionados con la salud metabólica.',
		],
		topics: [
			{
				title: 'Resistencia a la insulina',
				description:
					'Estrategias nutricionales adaptadas a la situación metabólica de cada persona, teniendo en cuenta los hábitos, la composición de la alimentación y los marcadores clínicos disponibles.',
			},
			{
				title: 'Alteraciones de glucosa y metabolismo glucídico',
				description:
					'Acompañamiento nutricional para mejorar la calidad de la alimentación y favorecer un mejor control metabólico, en coordinación con el seguimiento médico cuando corresponda.',
			},
			{
				title: 'Colesterol y perfil lipídico',
				description:
					'Adaptación de la alimentación para mejorar la calidad de las grasas, la fibra y el patrón dietético global, teniendo en cuenta el perfil lipídico individual.',
			},
			{
				title: 'Hígado graso y salud hepática',
				description:
					'Abordaje nutricional orientado a mejorar los hábitos alimentarios y los factores metabólicos relacionados con la salud hepática.',
			},
			{
				title: 'Sobrepeso y obesidad',
				description:
					'Acompañamiento nutricional individualizado, con especial atención a la salud, la suficiencia nutricional y la sostenibilidad de los cambios.',
			},
			{
				title: 'Composición corporal y masa muscular',
				description:
					'Trabajo nutricional orientado a mejorar o mantener la masa muscular, adaptar la ingesta energética y proteica y favorecer una composición corporal saludable.',
			},
			{
				title: 'Déficits nutricionales',
				description:
					'Valoración de la alimentación y del estado nutricional para identificar posibles insuficiencias de vitaminas, minerales y otros nutrientes, y plantear estrategias de corrección cuando estén indicadas.',
			},
		],
		closing:
			'La salud metabólica no se reduce al peso corporal. También importa cómo está nutrido el organismo, cómo responde a la alimentación y cómo evoluciona su funcionamiento.',
		forEveryone: true,
	},
];

export const schedule = [
	{
		mode: 'Consulta online',
		days: 'Martes y jueves',
		time: '16:00 – 19:00 h',
		description:
			'Podrás realizar tu consulta desde cualquier lugar, con el mismo proceso de valoración y seguimiento individualizado.',
	},
	{
		mode: 'Consulta presencial en Albacete',
		days: 'Miércoles',
		time: '17:30 – 20:30 h',
		description:
			'Un espacio de consulta presencial para realizar tu valoración y seguimiento nutricional.',
	},
];

export const contactInfo = {
	email: 'nutricionmaraolivares@gmail.com',
	license: 'MAD01729',
};

export const training = {
	academic: [
		'Doble Grado en Farmacia y Biotecnología · Universidad CEU San Pablo',
		'Grado en Nutrición Humana y Dietética · Universidad de Alcalá (CUNIMAD)',
		'Colegiada MAD01729',
	],
	complementary: [
		'Especialización en Nutrición, Medicina y Salud Hormonal en la Mujer · ICNS',
		'Formación en patologías digestivas · MPunti',
		'Formación en microbiota · Regenera',
		'Prácticas en Salud Digestiva y Microbiota con el Dr. Vigaray · Inmunomet',
		'Formación GIDS · Rocío Pérez',
		'Formación continuada en salud metabólica, hormonal y digestiva',
	],
};

export const healthIndicators = [
	{ title: 'Energía y vitalidad', description: 'Cómo te encuentras a lo largo del día.' },
	{ title: 'Descanso', description: 'Calidad del sueño y sensación de recuperación.' },
	{
		title: 'Salud digestiva',
		description: 'Digestiones, tránsito intestinal, molestias y tolerancia alimentaria.',
	},
	{
		title: 'Estado nutricional',
		description: 'Calidad, variedad, densidad de nutrientes y suficiencia de la alimentación.',
	},
	{ title: 'Sintomatología', description: 'Evolución de las molestias y otros síntomas relevantes.' },
	{
		title: 'Marcadores clínicos',
		description: 'Analíticas y parámetros objetivos cuando están indicados.',
	},
	{
		title: 'Estilo de vida',
		description: 'Alimentación, actividad física, descanso y hábitos cotidianos.',
	},
];

export const methodPhases = [
	{
		title: 'Valoración inicial',
		lead: 'Primero, necesito conocerte.',
		duration: '90 minutos',
		paragraphs: [
			'La primera consulta tiene una duración aproximada de 90 minutos.',
			'Durante este encuentro revisamos tu historia clínica, antecedentes, síntomas, alimentación, hábitos y objetivos.',
			'También valoramos las analíticas y pruebas disponibles cuando son relevantes para tu caso.',
			'El objetivo es reunir toda la información necesaria para comprender tu situación y establecer las prioridades de trabajo.',
		],
	},
	{
		title: 'Estrategia nutricional personalizada',
		lead: 'Una propuesta adaptada a tu realidad.',
		paragraphs: [
			'A partir de la valoración, elaboro una estrategia nutricional individualizada.',
			'No se trata de aplicar una dieta estándar, sino de construir una propuesta adaptada a tus necesidades nutricionales, preferencias, horarios, tolerancias, circunstancias y objetivos.',
			'Priorizamos una alimentación completa, suficiente y variada, con especial atención a la calidad de los alimentos y la densidad de nutrientes.',
			'Las recomendaciones deben ser realistas y compatibles con tu vida cotidiana.',
		],
	},
	{
		title: 'Seguimiento y evaluación',
		lead: 'Tu proceso evoluciona contigo.',
		duration: '≈ 60 minutos',
		paragraphs: [
			'El seguimiento permite valorar cómo estás respondiendo a la estrategia planteada y realizar los ajustes necesarios.',
			'No evaluamos únicamente el cumplimiento de las pautas o los cambios en el peso. También prestamos atención a la evolución de los síntomas, la energía, el descanso, la salud digestiva, la tolerancia alimentaria y otros indicadores relevantes.',
			'Las consultas de seguimiento tienen una duración de hasta 60 minutos.',
		],
	},
	{
		title: 'Consolidación de hábitos',
		lead: 'El objetivo es que los cambios permanezcan.',
		paragraphs: [
			'La nutrición debe integrarse en tu vida, no convertirse en una fuente constante de preocupación o restricciones.',
			'Trabajamos progresivamente para que puedas comprender tus necesidades, tomar decisiones alimentarias con autonomía y mantener los hábitos que contribuyen a tu salud.',
			'No buscamos llegar rápido. Buscamos construir una evolución sostenible.',
		],
	},
];

export const processAssessment = [
	'Historia clínica y antecedentes',
	'Calidad y suficiencia de la alimentación',
	'Ingesta y densidad de nutrientes',
	'Síntomas y evolución clínica',
	'Salud digestiva y tolerancia alimentaria',
	'Energía y vitalidad',
	'Sueño, descanso y recuperación',
	'Actividad física y hábitos cotidianos',
	'Analíticas y marcadores clínicos cuando proceda',
];

export const consultations = [
	{
		title: 'Primera consulta',
		price: '85 €',
		detail: '90 minutos',
		description:
			'Una primera valoración completa para conocer tu historia, comprender tus necesidades y establecer las prioridades de trabajo.',
		includes: [
			'Revisión de antecedentes e historia clínica',
			'Valoración de síntomas y objetivos',
			'Evaluación de hábitos y alimentación',
			'Revisión de analíticas y pruebas disponibles cuando proceda',
			'Definición de la estrategia nutricional individualizada',
		],
	},
	{
		title: 'Consulta de seguimiento',
		price: '55 €',
		detail: 'Hasta 60 minutos',
		description:
			'Un espacio para valorar tu evolución, resolver dudas y adaptar la estrategia nutricional según tu respuesta y necesidades.',
		includes: [
			'Revisión de la evolución',
			'Valoración de síntomas y bienestar',
			'Revisión de la alimentación y tolerancias',
			'Ajuste de las recomendaciones',
			'Nuevos objetivos cuando sea necesario',
		],
	},
	{
		title: 'Pack de acompañamiento nutricional',
		price: '200 €',
		detail: 'Ahorras 50 €',
		description:
			'El pack está pensado para quienes desean realizar un proceso con continuidad y seguimiento.',
		includes: ['1 primera consulta de 90 minutos', '3 consultas de seguimiento de hasta 60 minutos'],
		note: 'Precio por separado: 250 €. Precio del pack: 200 €.',
		featured: true,
	},
];

export const packConditions = [
	'Validez máxima de un año desde la fecha de compra.',
	'Las consultas deben reservarse con antelación.',
	'La reserva estará sujeta a disponibilidad de agenda.',
];

export const faqs = [
	{
		question: '¿Necesito tener una analítica reciente para empezar?',
		answer:
			'No es imprescindible. Si dispones de analíticas o pruebas recientes, podemos revisarlas durante la valoración cuando sean relevantes. Si no las tienes, valoraremos tu situación y determinaremos si es necesario solicitar alguna prueba a través del profesional sanitario correspondiente.',
	},
	{
		question: '¿Voy a recibir una dieta?',
		answer:
			'No trabajo con dietas cerradas ni menús estándar. Elaboro una estrategia nutricional individualizada, adaptada a tus necesidades, preferencias, horarios, tolerancias y objetivos. El contenido de las recomendaciones dependerá de cada caso.',
	},
	{
		question: '¿Tengo que pesar los alimentos o contar calorías?',
		answer:
			'No necesariamente. El enfoque no se basa en contar calorías de forma sistemática ni en imponer cantidades rígidas. La metodología se adapta a cada persona y a las necesidades de su proceso.',
	},
	{
		question: '¿Puedo acudir si no quiero perder peso?',
		answer:
			'Por supuesto. La consulta no está orientada exclusivamente a la pérdida de peso. También trabajamos salud hormonal, digestiva, metabólica, suficiencia nutricional, composición corporal y mejora de hábitos.',
	},
	{
		question: '¿La consulta de salud hormonal es solo para mujeres que quieren quedarse embarazadas?',
		answer:
			'No. La salud hormonal femenina abarca mucho más que la fertilidad. También trabajamos educación menstrual, conocimiento del ciclo, síntomas premenstruales, alteraciones menstruales y necesidades nutricionales en distintas etapas de la vida.',
	},
	{
		question: '¿Atendéis a hombres?',
		answer:
			'Sí. Las consultas de microbiota y salud digestiva y de salud metabólica están abiertas tanto a hombres como a mujeres.',
	},
	{
		question: '¿Puedo acudir si tengo una enfermedad diagnosticada?',
		answer:
			'Sí. La consulta puede ofrecer acompañamiento nutricional en personas con diferentes patologías, siempre respetando el ámbito de actuación profesional y coordinando el abordaje con el equipo médico cuando sea necesario.',
	},
	{
		question: '¿Cuánto dura el proceso?',
		answer:
			'Depende de cada persona, sus necesidades y objetivos. No existe una duración universal. El seguimiento se adapta a la evolución y a las circunstancias individuales.',
	},
	{
		question: '¿Puedo hacer las consultas online?',
		answer: 'Sí. Se realizan consultas online los martes y jueves por la tarde.',
	},
	{
		question: '¿Cómo puedo reservar?',
		answer:
			'Puedes solicitar tu cita a través del formulario de contacto de la web o mediante los datos de contacto indicados.',
	},
];
