import { createHash } from 'node:crypto';

export function trimEnd(text: string, chr: string): string {
  while (text.endsWith(chr)) {
    text = text.slice(0, text.length - chr.length);
  }
  return text;
}

export function removeTrailingSlash(path: string): string {
  const i = path.length - 1;
  return path[i] === '/' ? removeTrailingSlash(path.slice(0, i)) : path;
}

export function contentHash(obj: object) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}
