import type { SeedFile } from 'emdash';

const emptySeed: SeedFile = {
	version: '1',
	collections: [],
	taxonomies: [],
	content: {},
};

export const seed = emptySeed;
export const userSeed: SeedFile | null = null;
