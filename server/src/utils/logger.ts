import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// logs will be written to ./server/logs/YYYY-MM-DD.log in production, and to console in development
const LOG_DIR = join(process.cwd(), 'logs');
const isProd = process.env.NODE_ENV === 'production';

function formatEntry(src: string, fn: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const dataStr = data !== undefined ? ' ' + JSON.stringify(data) : '';
  return `[${ts}] [${src}] [${fn}] ${message}${dataStr}`;
}

export function log(src: string, fn: string, message: string, data?: unknown): void {
  const entry = formatEntry(src, fn, message, data);
  if (!isProd) {
    console.log(entry);
    return;
  }
  const date = new Date().toISOString().slice(0, 10);
  const file = join(LOG_DIR, `${date}.log`);
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(file, entry + '\n', 'utf8');
  } catch {
    console.error('Logger: failed to write entry:', entry);
  }
}
