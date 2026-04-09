import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { TaskType } from '../../../core/models/task';

interface BloqueTemario {
  titulo: string;
  abierto: boolean;
  icono: string;
  tareas: StudentTask[];
}

@Component({
  selector: 'app-temario-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule, BotonAtrasComponent],
  templateUrl: './temario-alumno.component.html',
  styleUrls: ['./temario-alumno.component.scss']
})
export class TemarioAlumnoComponent implements OnInit {
  private studentTaskService = inject(StudentTaskService);
  private route = inject(ActivatedRoute);

  loading = signal<boolean>(true);
  error = signal<string>('');
  
  bloques = signal<BloqueTemario[]>([]);

  SubmissionStatus = SubmissionStatus;
  claseEnCurso = decodeURIComponent(this.route.snapshot.paramMap.get('claseId') || '');

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.studentTaskService.getAllStudentTasks().subscribe({
      next: (res) => {
        if (res.success) {
          // filtrado por asignatura
          const filteredTasks = res.data.filter(t => 
             (t.task.teacherAssignment as any)?.subject?.name.toLowerCase() === this.claseEnCurso.toLowerCase()
          );
          this.groupTasksByType(filteredTasks);
        } else {
          this.error.set('No se pudieron obtener las tareas.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error del servidor al obtener tareas.');
        this.loading.set(false);
      }
    });
  }

  groupTasksByType(tasks: StudentTask[]) {
    const configBloques = [
      { tipo: TaskType.THEORY, titulo: 'Material Teórico y Documentos', icono: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
      { tipo: TaskType.EXAM, titulo: 'Exámenes y Pruebas', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362402.png' },
      { tipo: TaskType.PROJECT, titulo: 'Proyectos Evaluables', icono: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
      { tipo: TaskType.PRACTICE, titulo: 'Ejercicios Prácticos', icono: 'https://cdn-icons-png.flaticon.com/512/471/471495.png' },
      { tipo: TaskType.HOMEWORK, titulo: 'Deberes Generales', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362369.png' }
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
          titulo: conf.titulo,
          abierto: nuevosBloques.length === 0, 
          tareas: tareasDeTipo,
          icono: conf.icono
        });
      }
    }

    this.bloques.set(nuevosBloques);
  }

  toggleBloque(index: number): void {
    this.bloques.update(bs => {
      const clon = [...bs];
      // Solo dejamos uno abierto o simplemente alternamos
      clon[index].abierto = !clon[index].abierto;
      return clon;
    });
  }
}
