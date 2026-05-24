import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { TaskType } from '../../../core/models/task';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/**
 * Interfaz que define la estructura agrupada de un bloque temático en el acordeón del Temario.
 */
interface BloqueTemario {
  /** Clave i18n del bloque (syllabus.sections.*) */
  titleKey: string;
  /** Indica si este bloque está expandido visualmente */
  abierto: boolean;
  /** URL de icono asociado al bloque */
  icono: string;
  /** Tareas (StudentTasks) agrupadas correspondientes a este bloque */
  tareas: StudentTask[];
}

/**
 * Componente TemarioAlumno
 *
 * Responsable de renderizar las tareas y materiales de la asignatura
 * categorizados en bloques semánticos (acordeones) interactivos para el alumno.
 */
@Component({
  selector: 'app-temario-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, BotonAtrasComponent],
  templateUrl: './temario-alumno.component.html',
  styleUrls: ['./temario-alumno.component.scss']
})
export class TemarioAlumnoComponent implements OnInit {
  private studentTaskService = inject(StudentTaskService);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  loading = signal<boolean>(true);
  error = signal<string>('');

  bloques = signal<BloqueTemario[]>([]);

  SubmissionStatus = SubmissionStatus;
  claseEnCurso = decodeURIComponent(this.route.snapshot.paramMap.get('claseId') || '');

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Carga todas las tareas del estudiante y filtra por la asignatura actual.
   * Posteriormente, agrupa los resultados por tipo de tarea.
   */
  loadTasks() {
    this.studentTaskService.getAllStudentTasks().subscribe({
      next: (res) => {
        if (res.success) {
          const filteredTasks = res.data.filter(t =>
             t.task.teacherAssignment?.subject?.name?.toLowerCase() === this.claseEnCurso.toLowerCase()
          );
          this.groupTasksByType(filteredTasks);
        } else {
          this.error.set(this.translate.instant('common.errors.loadStudentTasksFailed'));
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(resolveApiError(this.translate, err, 'common.errors.connection'));
        this.loading.set(false);
      }
    });
  }

  /**
   * Categoriza las tareas en grupos (BloqueTemario) basados en su `TaskType`.
   * Verifica automáticamente si las tareas pendientes están atrasadas y cambia su estado local.
   * @param tasks Listado de tareas pre-filtradas para la asignatura actual.
   */
  groupTasksByType(tasks: StudentTask[]) {
    const configBloques = [
      { tipo: TaskType.THEORY, titleKey: 'syllabus.sections.THEORY', icono: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
      { tipo: TaskType.EXAM, titleKey: 'syllabus.sections.EXAM', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362402.png' },
      { tipo: TaskType.PROJECT, titleKey: 'syllabus.sections.PROJECT', icono: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
      { tipo: TaskType.PRACTICE, titleKey: 'syllabus.sections.PRACTICE', icono: 'https://cdn-icons-png.flaticon.com/512/471/471495.png' },
      { tipo: TaskType.HOMEWORK, titleKey: 'syllabus.sections.HOMEWORK', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362369.png' }
    ];

    const nuevosBloques: BloqueTemario[] = [];
    const now = new Date();
    for (const conf of configBloques) {
      const tareasDeTipo = tasks.filter(t => t.task.type === conf.tipo);

      if (tareasDeTipo.length > 0) {
        tareasDeTipo.sort((a, b) => new Date(a.task.dueDate).getTime() - new Date(b.task.dueDate).getTime());
        tareasDeTipo.forEach(t => {
          if (t.status === SubmissionStatus.PENDING && new Date(t.task.dueDate) < now) {
            t.status = SubmissionStatus.LATE;
          }
        });

        nuevosBloques.push({
          titleKey: conf.titleKey,
          abierto: nuevosBloques.length === 0,
          tareas: tareasDeTipo,
          icono: conf.icono
        });
      }
    }

    this.bloques.set(nuevosBloques);
  }

  /**
   * Alterna el estado (abierto/cerrado) del bloque de acordeón indicado en la interfaz.
   * @param index Posición del bloque dentro de la lista interactiva.
   */
  toggleBloque(index: number): void {
    this.bloques.update(bs => {
      const clon = [...bs];
      clon[index].abierto = !clon[index].abierto;
      return clon;
    });
  }
}
