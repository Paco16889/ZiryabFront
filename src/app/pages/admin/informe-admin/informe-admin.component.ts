import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
  private readonly analytics = inject(AnalyticsHttpService);
  private readonly courseService = inject(CourseService);
  private readonly groupService = inject(GroupService);

  readonly courses = this.courseService.courses;
  readonly groups = this.groupService.groups;

  anyo = environment.currentSchoolYear;
  ciclo = 'todos';
  grupo = 'todos';
  incluirInactivos = false;

  loading = signal(false);
  exporting = signal(false);
  errorMessage = signal<string | null>(null);
  summary = signal<AnalyticsSummary | null>(null);
  menuMobileOpen = false;

  readonly kpiCards = computed(() => {
    const k = this.summary()?.kpis ?? {};
    return [
      { key: 'informe.kpi.matriculas', value: k['total_matriculas'] ?? '—' },
      { key: 'informe.kpi.alumnos', value: k['alumnos_unicos'] ?? '—' },
      { key: 'informe.kpi.profesores', value: k['profesores_en_asignaciones'] ?? '—' },
      { key: 'informe.kpi.ciclos', value: k['ciclos_formativos'] ?? '—' },
      { key: 'informe.kpi.grupos', value: k['grupos'] ?? '—' },
      {
        key: 'informe.kpi.asistencia',
        value:
          k['tasa_asistencia_global_pct'] != null
            ? `${k['tasa_asistencia_global_pct']}%`
            : '—',
      },
      { key: 'informe.kpi.sesionesCanceladas', value: k['sesiones_canceladas'] ?? '—' },
    ];
  });

  readonly topGrupos = computed(() => {
    const rows = [...(this.summary()?.alumnosGrupo ?? [])];
    return rows
      .sort((a, b) => (b.alumnos_unicos ?? 0) - (a.alumnos_unicos ?? 0))
      .slice(0, 5);
  });

  ngOnInit(): void {
    this.courseService.loadCourses();
    this.groupService.loadGroups();
    this.refreshSummary();
  }

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
            err?.error?.message ?? err?.message ?? 'Error al cargar el resumen',
          );
        },
      });
  }

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
            err?.error?.message ?? err?.message ?? 'Error al exportar',
          );
        },
      });
  }

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
          err?.error?.message ?? err?.message ?? 'Error al descargar Power BI',
        );
      },
    });
  }

  abrirMenuMobile(): void {
    this.menuMobileOpen = true;
  }

  cerrarMenuMobile(): void {
    this.menuMobileOpen = false;
  }
}
