/** Clave de cookie para persistir tema. */
export const THEME_COOKIE_KEY = 'ziryab-theme';

/** Duración de cookie en segundos (1 año). */
export const THEME_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

export type ThemeMode = 'light' | 'dark';

const VALID_THEMES: readonly ThemeMode[] = ['light', 'dark'];

export function isThemeMode(value: string): value is ThemeMode {
  return (VALID_THEMES as readonly string[]).includes(value);
}

export function readThemeFromCookie(): ThemeMode | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE_KEY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  );
  if (!match) {
    return null;
  }

  const value = decodeURIComponent(match[1]);
  return isThemeMode(value) ? value : null;
}

export function writeThemeCookie(theme: ThemeMode): void {
  if (typeof document === 'undefined') {
    return;
  }

  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:'
      ? '; Secure'
      : '';

  document.cookie = `${THEME_COOKIE_KEY}=${encodeURIComponent(theme)}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

export function resolveInitialTheme(): ThemeMode {
  const fromCookie = readThemeFromCookie();
  if (fromCookie) {
    return fromCookie;
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}
