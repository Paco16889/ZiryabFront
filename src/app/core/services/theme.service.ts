import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  readThemeFromCookie,
  resolveInitialTheme,
  ThemeMode,
  writeThemeCookie,
} from '../utils/theme-cookie.util';

const META_THEME_COLOR_LIGHT = '#d8b4fe';
const META_THEME_COLOR_DARK = '#7e22ce';

/** Rutas admin donde se aplica la clase `dark` de Tailwind. */
const ADMIN_THEME_PATHS = ['/dashboard-admin', '/informe'] as const;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly router = inject(Router);

  readonly activeTheme = signal<ThemeMode>('light');

  init(): void {
    const theme = resolveInitialTheme();
    this.applyTheme(theme);

    if (!readThemeFromCookie()) {
      writeThemeCookie(theme);
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.syncDocumentDarkClass());
  }

  /** Indica si la URL actual pertenece al área admin con soporte de modo oscuro. */
  isAdminArea(): boolean {
    const url = this.router.url.split('?')[0];
    return ADMIN_THEME_PATHS.some(
      (path) => url === path || url.startsWith(`${path}/`),
    );
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
    this.syncDocumentDarkClass();
    this.updateThemeColorMeta(theme);
  }

  private syncDocumentDarkClass(): void {
    const useDark = this.activeTheme() === 'dark' && this.isAdminArea();
    document.documentElement.classList.toggle('dark', useDark);
  }

  private updateThemeColorMeta(theme: ThemeMode): void {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      return;
    }
    const useDark = theme === 'dark' && this.isAdminArea();
    meta.content = useDark ? META_THEME_COLOR_DARK : META_THEME_COLOR_LIGHT;
  }
}
