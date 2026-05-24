import { Component, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleCreateTemplateComponent } from '../week-schedule-create-template/week-schedule-create-template.component';
import { WeekScheduleGridBuilderComponent } from '../week-schedule-grid-builder/week-schedule-grid-builder.component';

/** Pestañas disponibles en el constructor de horarios de administración. */
export type WeekScheduleBuilderMode = 'create' | 'grid';

/**
 * Orquestador del flujo de creación de horarios en admin.
 * Shell con pestañas: plantilla por clase (create) y rejilla semanal (grid).
 */
@Component({
  selector: 'app-week-schedule-builder',
  standalone: true,
  imports: [
    TranslateModule,
    WeekScheduleCreateTemplateComponent,
    WeekScheduleGridBuilderComponent,
  ],
  templateUrl: './week-schedule-builder.component.html',
  styleUrl: './week-schedule-builder.component.scss',
})
export class WeekScheduleBuilderComponent {
  /** Propaga al contenedor padre la salida del flujo sin crear ni guardar horarios. */
  readonly cancelCreate = output<void>();

  /** Avisa al contenedor padre de que hay horarios nuevos o actualizados. */
  readonly scheduleCreated = output<void>();

  /** Pestaña por defecto: crear plantilla (CURSO-90). */
  readonly builderMode = signal<WeekScheduleBuilderMode>('create');

  /** Cierra el builder desde cualquiera de sus pestañas. */
  onCancel(): void {
    this.cancelCreate.emit();
  }

  /** Cambia entre creación por plantilla y edición directa en grid semanal. */
  setBuilderMode(mode: WeekScheduleBuilderMode): void {
    this.builderMode.set(mode);
  }

  /** Reemite el guardado producido por el grid para refrescar listados externos. */
  onGridScheduleSaved(): void {
    this.scheduleCreated.emit();
  }
}
