import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Bloque de día de la semana y rango horario del builder admin.
 */
@Component({
  selector: 'app-week-schedule-builder-slot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './week-schedule-builder-slot-form.component.html',
  styleUrl: './week-schedule-builder-slot-form.component.scss',
})
export class WeekScheduleBuilderSlotFormComponent {
  readonly form = input.required<FormGroup>();
  readonly weekdays = input.required<readonly number[]>();

  timeOrderInvalid(): boolean {
    const g = this.form();
    if (!g.touched && !g.dirty) {
      return false;
    }
    return g.hasError('timeOrder');
  }
}
