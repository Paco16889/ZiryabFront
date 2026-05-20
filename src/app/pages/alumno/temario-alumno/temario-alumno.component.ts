import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { TaskType } from '../../../core/models/task';

/**
 * Interfaz que define la estructura agrupada de un bloque tem?tico en el acorde?n del Temario.
 */
interface BloqueTemario {
  /** T?tulo del bloque (ej: "Material Te?rico y Documentos") */
  titulo: string;
  /** Indica si este bloque est? expandido visualmente */
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
 * categorizados en bloques sem?nticos (acordeones) interactivos para el alumno.
 */
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

  /**
   * Carga todas las tareas del estudiante y filtra por la asignatura actual.
   * Posteriormente, agrupa los resultados por tipo de tarea.
   */
  loadTasks() {
    this.studentTaskService.getAllStudentTasks().subscribe({
      next: (res) => {
        if (res.success) {
          // filtrado por asignatura
          const filteredTasks = res.data.filter(t => 
             (t.task.teacherAssignment as any)?.subject?.name.toLowerCase() === this.claseEnCurso.toLowerCase()
          );
          // #region agent log
          fetch('http://127.0.0.1:7267/ingest/f50d56cc-b2b4-4418-8246-7068a7efecd0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7c22e9'},body:JSON.stringify({sessionId:'7c22e9',location:'temario-alumno.component.ts:loadTasks',message:'temario filter',data:{claseEnCurso:this.claseEnCurso,apiCount:res.data.length,filteredCount:filteredTasks.length,task18:res.data.filter((t:any)=>t.idTask===18).length,subjects:res.data.map((t:any)=>t.task?.teacherAssignment?.subject?.name)},timestamp:Date.now(),hypothesisId:'H2-H4'})}).catch(()=>{});
          // #endregion
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

  /**
   * Categoriza las tareas en grupos (BloqueTemario) basados en su `TaskType`.
   * Verifica autom?ticamente si las tareas pendientes est?n atrasadas y cambia su estado local.
   * @param tasks Listado de tareas pre-filtradas para la asignatura actual.
   */
  groupTasksByType(tasks: StudentTask[]) {
    const configBloques = [
      { tipo: TaskType.THEORY, titulo: 'Material Te?rico y Documentos', icono: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
      { tipo: TaskType.EXAM, titulo: 'Ex?menes y Pruebas', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362402.png' },
      { tipo: TaskType.PROJECT, titulo: 'Proyectos Evaluables', icono: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
      { tipo: TaskType.PRACTICE, titulo: 'Ejercicios Pr?cticos', icono: 'https://cdn-icons-png.flaticon.com/512/471/471495.png' },
      { tipo: TaskType.HOMEWORK, titulo: 'Deberes Generales', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362369.png' }
    ];

    const nuevosBloques: BloqueTemario[] = [];
    const now = new Date();
    const typeCounts: Record<string, number> = {};
    for (const t of tasks) {
      const ty = t.task?.type ?? 'MISSING';
      typeCounts[ty] = (typeCounts[ty] ?? 0) + 1;
    }
    // #region agent log
    fetch('http://127.0.0.1:7267/ingest/f50d56cc-b2b4-4418-8246-7068a7efecd0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7c22e9'},body:JSON.stringify({sessionId:'7c22e9',location:'temario-alumno.component.ts:groupTasksByType',message:'group by task type',data:{typeCounts,enumProject:TaskType.PROJECT,totalInput:tasks.length},timestamp:Date.now(),hypothesisId:'H4-H7'})}).catch(()=>{});
    // #endregion

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

  /**
   * Alterna el estado (abierto/cerrado) del bloque de acorde?n indicado en la interfaz.
   * @param index Posici?n del bloque dentro de la lista interactiva.
   */
  toggleBloque(index: number): void {
    this.bloques.update(bs => {
      const clon = [...bs];
      // Solo dejamos uno abierto o simplemente alternamos
      clon[index].abierto = !clon[index].abierto;
      return clon;
    });
  }
}
