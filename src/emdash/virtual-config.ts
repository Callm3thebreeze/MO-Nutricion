import { sqlite } from 'emdash/db';

export default {
	database: sqlite({ url: 'file:./.emdash/data.db' }),
};
