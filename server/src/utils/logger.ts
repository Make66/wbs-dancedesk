import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// logs will be written to ./server/logs/YYYY-MM-DD.log in production, and to console in development
const LOG_DIR = join(process.cwd(), 'logs');
const isProd = process.env.NODE_ENV === 'production';

const c = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  yellow: '\x1b[33m',
  darkYellow: '\x1b[33m',
};

function bracket(color: string, text: string): string {
  return `${c.dim}[${c.reset}${color}${text}${c.reset}${c.dim}]${c.reset}`;
}

function formatEntry(src: string, fn: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const dataStr = data !== undefined ? ' ' + JSON.stringify(data) : '';
  return `[${ts}] [${src}] [${fn}] ${message}${dataStr}`;
}

function formatEntryColor(src: string, fn: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const dataStr = data !== undefined ? ' ' + JSON.stringify(data) : '';
  return `${bracket(c.darkYellow, ts)} ${bracket(c.cyan, src)} ${bracket(c.yellow, fn)} ${message}${dataStr}`;
}

export function log(src: string, fn: string, message: string, data?: unknown): void {
  if (!isProd) {
    console.log(formatEntryColor(src, fn, message, data));
    return;
  }
  const entry = formatEntry(src, fn, message, data);
  const date = new Date().toISOString().slice(0, 10);
  const file = join(LOG_DIR, `${date}.log`);
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(file, entry + '\n', 'utf8');
  } catch {
    console.error('Logger: failed to write entry:', entry);
  }
}
