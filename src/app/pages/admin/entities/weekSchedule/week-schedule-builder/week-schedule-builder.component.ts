import { Component, inject, OnInit, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { WeekScheduleClassItem, weekScheduleClassKey } from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { WeekScheduleNavigationService } from '../../../../../core/services/UI/week-schedule-navigation.service';
import { weekScheduleClassKeyFromParts } from '../../../../../core/utils/week-schedule-class-key';
import { WeekScheduleCreateTemplateComponent } from '../week-schedule-create-template/week-schedule-create-template.component';
import { WeekScheduleGridBuilderComponent } from '../week-schedule-grid-builder/week-schedule-grid-builder.component';

/** Pestaña activa del builder: crear plantilla o editar rejilla semanal. */
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
export class WeekScheduleBuilderComponent implements OnInit {
  /** Contexto pendiente al llegar desde asignaciones docentes (EQ-309). */
  private readonly scheduleNav = inject(WeekScheduleNavigationService);

  /** Notifica al menú admin que el horario quedó guardado o materializado. */
  readonly scheduleCreated = output<void>();

  /** Pestaña por defecto: crear plantilla (CURSO-90). */
  readonly builderMode = signal<WeekScheduleBuilderMode>('create');

  /** Clase a preseleccionar en rejilla tras materializar (CURSO-145). */
  readonly gridPreselectClassKey = signal<string | null>(null);

  /** Clase a preseleccionar en crear plantilla (EQ-309). */
  readonly createPreselectClassKey = signal('');

  /** Aplica contexto pendiente de navegación desde asignaciones docentes. */
  ngOnInit(): void {
    const pending = this.scheduleNav.takePendingCreate();
    if (pending == null) {
      return;
    }
    this.setBuilderMode('create');
    this.createPreselectClassKey.set(
      weekScheduleClassKeyFromParts(
        pending.idCourse,
        pending.grade,
        pending.idGroup,
        environment.currentSchoolYear,
      ),
    );
  }

  /** Cambia entre pestaña de plantilla y rejilla. */
  setBuilderMode(mode: WeekScheduleBuilderMode): void {
    this.builderMode.set(mode);
  }

  /** La rejilla guardó cambios; propaga evento al contenedor. */
  onGridScheduleSaved(): void {
    this.scheduleCreated.emit();
  }

  /** Tras materializar: ir a rejilla y preseleccionar la clase creada (CURSO-145). */
  onTemplateCreated(cls: WeekScheduleClassItem): void {
    this.gridPreselectClassKey.set(weekScheduleClassKey(cls));
    this.setBuilderMode('grid');
    this.scheduleCreated.emit();
  }
}
