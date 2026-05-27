import { Injectable, signal } from '@angular/core';
import {
  readThemeFromCookie,
  resolveInitialTheme,
  ThemeMode,
  writeThemeCookie,
} from '../utils/theme-cookie.util';

const META_THEME_COLOR_LIGHT = '#d8b4fe';
const META_THEME_COLOR_DARK = '#7e22ce';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly activeTheme = signal<ThemeMode>('light');

  init(): void {
    const theme = resolveInitialTheme();
    this.applyTheme(theme);

    if (!readThemeFromCookie()) {
      writeThemeCookie(theme);
    }
  }

  toggle(): void {
    const next: ThemeMode = this.activeTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: ThemeMode): void {
    this.applyTheme(theme);
    writeThemeCookie(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    this.activeTheme.set(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    this.updateThemeColorMeta(theme);
  }

  private updateThemeColorMeta(theme: ThemeMode): void {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      return;
    }
    meta.content = theme === 'dark' ? META_THEME_COLOR_DARK : META_THEME_COLOR_LIGHT;
  }
}
