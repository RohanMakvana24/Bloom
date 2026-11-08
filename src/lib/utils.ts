export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];

function toVal(mix: ClassValue): string {
  let k: string | number;
  let y: string;
  let str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object' && mix !== null) {
    if (Array.isArray(mix)) {
      const len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          y = toVal(mix[k]);
          if (y) {
            if (str) str += ' ';
            str += y;
          }
        }
      }
    } else {
      for (const key in mix) {
        if (Object.prototype.hasOwnProperty.call(mix, key) && mix[key]) {
          if (str) str += ' ';
          str += key;
        }
      }
    }
  }

  return str;
}

export function cn(...inputs: ClassValue[]): string {
  const raw = toVal(inputs);
  if (!raw) return '';
  const tokens = raw.trim().split(/\s+/);
  const seen = new Set<string>();
  const result: string[] = [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    if (!seen.has(token)) {
      seen.add(token);
      result.unshift(token);
    }
  }
  return result.join(' ');
}

export type ThemeMode = 'light' | 'dark' | 'system';

export function resolveThemeMode(
  theme: ThemeMode | string | undefined,
  systemTheme: 'light' | 'dark' = 'dark'
): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return systemTheme;
}

export function getNextTheme(
  theme: ThemeMode | string | undefined,
  systemTheme: 'light' | 'dark' = 'dark'
): 'light' | 'dark' {
  const current = resolveThemeMode(theme, systemTheme);
  return current === 'dark' ? 'light' : 'dark';
}
