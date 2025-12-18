import { Component, Input } from '@angular/core';
import { Subject } from '../../../core/models/subject';

@Component({
  selector: 'app-subject',
  imports: [],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class SubjectComponent {
    @Input() subject!: Subject;
}
