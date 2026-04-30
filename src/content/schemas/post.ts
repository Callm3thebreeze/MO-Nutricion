import type { PortableTextBlock } from 'emdash';

export const POST_CATEGORIES = ['salud-digestiva', 'microbiota', 'salud-hormonal', 'habitos'] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export interface BlogPost {
slug: string;
title: string;
excerpt: string;
publishedAt: string;
updatedAt?: string;
category: PostCategory;
tags: string[];
coverImage: {
src: string;
alt: string;
};
content: PortableTextBlock[];
seoTitle?: string;
seoDescription?: string;
canonicalUrl?: string;
draft?: boolean;
}
