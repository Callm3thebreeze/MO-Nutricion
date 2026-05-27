import { d1, r2 } from '@emdash-cms/cloudflare';

export default {
	database: d1({ binding: 'EMDASH_DB', session: 'auto' }),
	storage: r2({ binding: 'EMDASH_MEDIA' }),
};
