import { createHash } from 'node:crypto';

export function trimEnd(text: string, chr: string): string {
  while (text.endsWith(chr)) {
    text = text.slice(0, text.length - chr.length);
  }
  return text;
}

export function removeTrailingSlash(path: string): string {
  return path.replace(/\/+$/, '');
}

export function contentHash(obj: object) {
  return createHash('sha1').update(JSON.stringify(obj)).digest('hex');
}
