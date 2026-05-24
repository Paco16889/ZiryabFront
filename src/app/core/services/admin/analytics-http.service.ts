import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  AnalyticsExportParams,
  AnalyticsSummary,
  AnalyticsSummaryResponse,
} from '../../models/analytics';

interface ApiMessage {
  message: string;
  code?: string;
}

/**
 * Informes analíticos Ziryab (Pandas + exportación CSV/XLSX y Power BI).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsHttpService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly baseUrl = `${environment.apiUrl}/analytics`;

  /**
   * KPIs y tablas para el dashboard de informes (respeta filtros, no completo).
   */
  getSummary(params: Omit<AnalyticsExportParams, 'formato' | 'completo'>): Observable<AnalyticsSummary> {
    const httpParams = this.buildParams({
      ...params,
      formato: 'xlsx',
      completo: false,
    });
    return this.http
      .get<AnalyticsSummaryResponse>(`${this.baseUrl}/summary`, { params: httpParams })
      .pipe(map((res) => res.data));
  }

  /**
   * Descarga CSV o XLSX (completo o filtrado según `completo`).
   */
  downloadExport(params: AnalyticsExportParams): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export`, {
      params: this.buildParams(params),
      responseType: 'blob',
    });
  }

  /** Informe Power BI estático (.pbix). */
  downloadPbix(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/report.pbix`, {
      responseType: 'blob',
    });
  }

  private buildParams(params: AnalyticsExportParams): HttpParams {
    let p = new HttpParams()
      .set('anyo', params.anyo)
      .set('formato', params.formato)
      .set('inactivos', params.inactivos ? 'true' : 'false');

    if (params.completo) {
      p = p.set('completo', 'true');
    } else {
      p = p.set('ciclo', params.ciclo || 'todos');
      p = p.set('grupo', params.grupo || 'todos');
    }

    return p;
  }

  /** Dispara la descarga en el navegador. */
  saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  /** Muestra mensaje de error si el blob es JSON de error del API. */
  async handleDownloadError(blob: Blob): Promise<string | null> {
    if (blob.type.includes('json') || blob.size < 5000) {
      try {
        const text = await blob.text();
        const parsed = JSON.parse(text) as ApiMessage;
        if (parsed.code) {
          const key = `apiErrors.${parsed.code}`;
          const translated = this.translate.instant(key);
          if (translated && translated !== key) {
            return translated;
          }
        }
        return parsed.message ?? text;
      } catch {
        return null;
      }
    }
    return null;
  }
}
