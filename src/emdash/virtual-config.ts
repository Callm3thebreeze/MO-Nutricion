import { d1, r2 } from '@emdash-cms/cloudflare';

export default {
	database: d1({ binding: 'EMDASH_DB', session: 'auto' }),
	storage: r2({ binding: 'EMDASH_MEDIA' }),
	// solo se empaquetan las traducciones del panel en español (el inglés va siempre).
	// Las de los 36 idiomas ocupan ~6,8 MB y harían superar el límite de tamaño del Worker.
	admin: { locales: ['es-ES'] },
};
