import type { PortableTextBlock } from 'emdash';

export const isRecord = (value: unknown): value is Record<string, unknown> =>
typeof value === 'object' && value !== null;

export const asString = (value: unknown): string | null =>
typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

export const asStringArray = (value: unknown): string[] => {
if (Array.isArray(value)) {
return value
.filter((item): item is string => typeof item === 'string')
.map((item) => item.trim())
.filter(Boolean);
}

if (typeof value === 'string') {
return value
.split(',')
.map((item) => item.trim())
.filter(Boolean);
}

return [];
};

export const asBoolean = (value: unknown): boolean | null =>
typeof value === 'boolean' ? value : null;

export const toPortableText = (value: unknown): PortableTextBlock[] => {
if (Array.isArray(value)) {
return value.filter((item): item is PortableTextBlock => isRecord(item));
}

if (typeof value === 'string' && value.trim().length > 0) {
const chunks = value
.split('\n')
.map((line) => line.trim())
.filter(Boolean);

return chunks.map((line, index) => {
const isHeading = line.startsWith('## ');
const text = isHeading ? line.replace(/^##\s+/, '') : line;
return {
_type: 'block',
_key: `fallback-${index}`,
style: isHeading ? 'h2' : 'normal',
markDefs: [],
children: [{ _type: 'span', text, marks: [] }],
};
});
}

return [];
};
