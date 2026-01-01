import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-student-mode-selector',
  imports: [],
  templateUrl: './student-mode-selector.component.html',
  styleUrl: './student-mode-selector.component.scss'
})
export class StudentModeSelectorComponent {
  @Output() modeSelected = new EventEmitter<'new' | 'existing'>();

  setMode(mode: 'new' | 'existing') {
    this.modeSelected.emit(mode);
  }
}
