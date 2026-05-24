import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';
import { environment } from '../../../../environments/environment';
import { AnalyticsSummary } from '../../../core/models/analytics';
import { AnalyticsHttpService } from '../../../core/services/admin/analytics-http.service';
import { CourseService } from '../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../core/services/admin/entities/group.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { BotonHamburguesaComponent } from '../botones/boton-hamburguesa/boton-hamburguesa.component';

/**
 * Panel de informes analíticos para administradores (estilo TRIPMATEAI).
 * Filtros + KPIs + exportación CSV/XLSX completo o filtrado + descarga .pbix.
 */
@Component({
  selector: 'app-informe-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterLink,
    AdminMenuComponent,
    BotonAtrasComponent,
    BotonHamburguesaComponent,
  ],
  templateUrl: './informe-admin.component.html',
  styleUrl: './informe-admin.component.scss',
})
export class InformeAdminComponent implements OnInit {
  /** Servicio de analytics encargado de resumen, exportaciones y PBIX. */
  private readonly analytics = inject(AnalyticsHttpService);

  /** Servicio que precarga ciclos/cursos para el filtro de informes. */
  private readonly courseService = inject(CourseService);

  /** Servicio que precarga grupos para el filtro de informes. */
  private readonly groupService = inject(GroupService);

  /** Traducciones de etiquetas del panel y errores devueltos por el backend. */
  private readonly translate = inject(TranslateService);

  /** Catálogo de ciclos disponible para el select de filtro. */
  readonly courses = this.courseService.courses;

  /** Catálogo de grupos disponible para el select de filtro. */
  readonly groups = this.groupService.groups;

  /** Curso escolar seleccionado para resumen y exportaciones. */
  anyo = environment.currentSchoolYear;

  /** Ciclo seleccionado; `todos` indica que no se filtra por ciclo. */
  ciclo = 'todos';

  /** Grupo seleccionado; `todos` indica que no se filtra por grupo. */
  grupo = 'todos';

  /** Incluye matrículas inactivas cuando se calcula o exporta el informe. */
  incluirInactivos = false;

  /** Estado de carga del resumen visible en pantalla. */
  loading = signal(false);

  /** Estado de descarga de CSV/XLSX/PBIX para bloquear botones. */
  exporting = signal(false);

  /** Mensaje de error ya traducido para mostrar en la UI. */
  errorMessage = signal<string | null>(null);

  /** Resumen devuelto por el backend con KPIs y tablas. */
  summary = signal<AnalyticsSummary | null>(null);

  /** Controla el menú lateral en versión móvil del panel admin. */
  menuMobileOpen = false;

  /** Tarjetas de KPIs normalizadas para renderizar valores vacíos de forma consistente. */
  readonly kpiCards = computed(() => {
    const k = this.summary()?.kpis ?? {};
    const empty = this.translate.instant('common.noData');
    return [
      { key: 'informe.kpi.matriculas', value: k['total_matriculas'] ?? empty },
      { key: 'informe.kpi.alumnos', value: k['alumnos_unicos'] ?? empty },
      { key: 'informe.kpi.profesores', value: k['profesores_en_asignaciones'] ?? empty },
      { key: 'informe.kpi.ciclos', value: k['ciclos_formativos'] ?? empty },
      { key: 'informe.kpi.grupos', value: k['grupos'] ?? empty },
      {
        key: 'informe.kpi.asistencia',
        value:
          k['tasa_asistencia_global_pct'] != null
            ? `${k['tasa_asistencia_global_pct']}%`
            : empty,
      },
      { key: 'informe.kpi.sesionesCanceladas', value: k['sesiones_canceladas'] ?? empty },
    ];
  });

  /** Cinco grupos con más alumnos únicos, usados como ranking rápido del informe. */
  readonly topGrupos = computed(() => {
    const rows = [...(this.summary()?.alumnosGrupo ?? [])];
    return rows
      .sort((a, b) => (b.alumnos_unicos ?? 0) - (a.alumnos_unicos ?? 0))
      .slice(0, 5);
  });

  /** Carga catálogos de filtros y el resumen inicial del curso activo. */
  ngOnInit(): void {
    this.courseService.loadCourses();
    this.groupService.loadGroups();
    this.refreshSummary();
  }

  /** Solicita al backend el resumen filtrado y actualiza KPIs/tablas. */
  refreshSummary(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.analytics
      .getSummary({
        anyo: this.anyo,
        ciclo: this.ciclo,
        grupo: this.grupo,
        inactivos: this.incluirInactivos,
      })
      .subscribe({
        next: (data) => {
          this.summary.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            resolveApiError(this.translate, err, 'common.errors.loadSummary'),
          );
        },
      });
  }

  /** Descarga CSV/XLSX completo o filtrado y muestra errores si el backend devuelve JSON. */
  exportFile(formato: 'csv' | 'xlsx', completo: boolean): void {
    this.exporting.set(true);
    this.errorMessage.set(null);
    this.analytics
      .downloadExport({
        anyo: this.anyo,
        ciclo: this.ciclo,
        grupo: this.grupo,
        inactivos: this.incluirInactivos,
        formato,
        completo,
      })
      .subscribe({
        next: async (blob) => {
          const err = await this.analytics.handleDownloadError(blob);
          if (err) {
            this.errorMessage.set(err);
            this.exporting.set(false);
            return;
          }
          const scope = completo ? 'completo' : 'filtrado';
          const filename = `ziryab_informe_${this.anyo}_${scope}.${formato}`;
          this.analytics.saveBlob(blob, filename);
          this.exporting.set(false);
        },
        error: (err) => {
          this.exporting.set(false);
          this.errorMessage.set(
            resolveApiError(this.translate, err, 'common.errors.export'),
          );
        },
      });
  }

  /** Descarga el fichero Power BI preconstruido asociado al informe del proyecto. */
  downloadPowerBi(): void {
    this.exporting.set(true);
    this.errorMessage.set(null);
    this.analytics.downloadPbix().subscribe({
      next: async (blob) => {
        const err = await this.analytics.handleDownloadError(blob);
        if (err) {
          this.errorMessage.set(err);
          this.exporting.set(false);
          return;
        }
        this.analytics.saveBlob(blob, 'ziryab_informe.pbix');
        this.exporting.set(false);
      },
      error: (err) => {
        this.exporting.set(false);
        this.errorMessage.set(
          resolveApiError(this.translate, err, 'common.errors.downloadPowerBi'),
        );
      },
    });
  }

  /** Abre el menú móvil de administración. */
  abrirMenuMobile(): void {
    this.menuMobileOpen = true;
  }

  /** Cierra el menú móvil de administración. */
  cerrarMenuMobile(): void {
    this.menuMobileOpen = false;
  }
}
