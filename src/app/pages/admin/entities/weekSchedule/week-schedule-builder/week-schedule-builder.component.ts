import { Component, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleCreateTemplateComponent } from '../week-schedule-create-template/week-schedule-create-template.component';
import { WeekScheduleGridBuilderComponent } from '../week-schedule-grid-builder/week-schedule-grid-builder.component';

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
  readonly cancelCreate = output<void>();
  readonly scheduleCreated = output<void>();

  /** Pestaña por defecto: crear plantilla (CURSO-90). */
  readonly builderMode = signal<WeekScheduleBuilderMode>('create');

  onCancel(): void {
    this.cancelCreate.emit();
  }

  setBuilderMode(mode: WeekScheduleBuilderMode): void {
    this.builderMode.set(mode);
  }

  onGridScheduleSaved(): void {
    this.scheduleCreated.emit();
  }
}
