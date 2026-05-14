import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { AuthService } from '../../../core/services/auth.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AttendanceService, AttendanceRecord, AttendanceStatus } from '../../../core/services/attendance.service';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskType } from '../../../core/models/task';
import { Router } from '@angular/router';
import { StudentBySubject } from '../../../core/models/student-by-subject';

export interface BloqueTemario {
  id: number;
  titulo: string;
  abierta: boolean;
  icono: string;
  tareas: Task[];
}

/**
 * Componente que muestra el temario de una asignatura.
 * Incluye un apartado de "Pasar lista" donde pueden registrar la asistencia de 
 * todos los alumnos matriculados en la asignatura.
 */
@Component({
    selector: 'app-temario-profesor',
    standalone: true,
    imports: [CommonModule, BotonAtrasComponent],
    templateUrl: './temario-profesor.component.html',
    styleUrls: ['./temario-profesor.component.scss']
})
export class TemarioProfesorComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private clasesService = inject(ClasesService);
    private attendanceSvc = inject(AttendanceService);
    private taskService = inject(TaskService);
    private router = inject(Router);

    bloques = signal<BloqueTemario[]>([]);
    claseEnCurso = decodeURIComponent(this.route.snapshot.paramMap.get('claseId') || '');

    subjectId: number | null = null;
    alumnos = signal<StudentBySubject[]>([]);
    tasksLoadError = signal(false);
    attendanceMap: Record<number, AttendanceStatus> = {};
    loadingAlumnos = signal(false);
    saving = signal(false);
    saveMessage = signal('');
    saveError = signal(false);
    showAttendanceModal = signal(false);

    readonly statusOptions: { value: AttendanceStatus; label: string; color: string }[] = [
        { value: 'PRESENT', label: 'Presente', color: 'emerald' },
        { value: 'ABSENT', label: 'Ausente', color: 'red' },
        { value: 'LATE', label: 'Retraso', color: 'amber' },
        { value: 'EXCUSED', label: 'Justificado', color: 'blue' },
    ];

    ngOnInit(): void {
        const param = this.route.snapshot.queryParamMap.get('subjectId');
        if (param) {
            this.subjectId = Number(param);
            this.loadAlumnos();
        }
        this.loadTasks();
    }

    loadTasks() {
      this.taskService.getAllTasks().subscribe({
        next: (res) => {
          if (res.success) {
            const filteredTasks = res.data.filter(t => 
               t.teacherAssignment?.subject?.name?.toLowerCase() === this.claseEnCurso.toLowerCase()
            );
            this.groupTasksByType(filteredTasks);
          }
        },
        error: (err) => {
          console.error(err);
          this.tasksLoadError.set(true);
        }
      });
    }

    groupTasksByType(tasks: Task[]) {
      const configBloques = [
        { tipo: TaskType.THEORY, titulo: 'Material Teórico y Documentos', icono: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
        { tipo: TaskType.EXAM, titulo: 'Exámenes y Pruebas', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362402.png' },
        { tipo: TaskType.PROJECT, titulo: 'Proyectos Evaluables', icono: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
        { tipo: TaskType.PRACTICE, titulo: 'Ejercicios Prácticos', icono: 'https://cdn-icons-png.flaticon.com/512/471/471495.png' },
        { tipo: TaskType.HOMEWORK, titulo: 'Deberes Generales', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362369.png' }
      ];

      const nuevosBloques: BloqueTemario[] = [];
      const user = this.authService.getCurrentUser();
      for (const conf of configBloques) {
        // Filtrar tareas que pertenecen al profesor logueado además de a la clase
        const tareasDeTipo = tasks.filter(t => t.type === conf.tipo && t.teacherAssignment?.idTeacher === user?.id);
        
        if (tareasDeTipo.length > 0) {
          tareasDeTipo.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          nuevosBloques.push({
            id: nuevosBloques.length + 1,
            titulo: conf.titulo,
            abierta: nuevosBloques.length === 0,
            icono: conf.icono,
            tareas: tareasDeTipo
          });
        }
      }
      this.bloques.set(nuevosBloques);
    }

    toggleBloque(id: number): void {
        this.bloques.update(bs => bs.map(b => ({
            ...b,
            abierta: b.id === id ? !b.abierta : b.abierta
        })));
    }

    goToEntregas(taskId: number): void {
      this.router.navigate(['/tarea', taskId, 'entregas']);
    }

    private loadAlumnos(): void {
        this.loadingAlumnos.set(true);
        this.clasesService.getStudentsBySubject(this.subjectId!).subscribe({
            next: (response) => {
                this.alumnos.set(response.data);
                response.data.forEach((alumno: StudentBySubject) => {
                    this.attendanceMap[alumno.enrollmentId] = 'PRESENT';
                });
                this.loadingAlumnos.set(false);
            },
            error: () => {
                this.loadingAlumnos.set(false);
            }
        });
    }

    setStatus(enrollmentId: number, status: AttendanceStatus): void {
        this.attendanceMap = { ...this.attendanceMap, [enrollmentId]: status };
    }

    guardarAsistencia(): void {
        const user = this.authService.getCurrentUser();
        if (!user || !this.subjectId) return;

        this.saving.set(true);
        this.saveMessage.set('');

        this.attendanceSvc.startSession(this.subjectId, user.id).subscribe({
            next: (sessionId) => {
                const records: AttendanceRecord[] = Object.entries(this.attendanceMap).map(
                    ([enrollmentId, status]) => ({
                        idSession: sessionId,
                        idStudentEnrollment: Number(enrollmentId),
                        status,
                    })
                );

                this.attendanceSvc.saveBulk(records).subscribe({
                    next: () => {
                        this.saving.set(false);
                        this.saveError.set(false);
                        this.saveMessage.set('Asistencia guardada correctamente');
                        setTimeout(() => {
                            this.closeAttendanceModal();
                        }, 1500);
                    },
                    error: () => {
                        this.saving.set(false);
                        this.saveError.set(true);
                        this.saveMessage.set('Error al guardar la asistencia');
                    }
                });
            },
            error: (err) => {
                this.saving.set(false);
                this.saveError.set(true);
                this.saveMessage.set(`❌ ${err?.error?.message ?? 'Error al obtener la sesión'}`);
            }
        });
    }

    openAttendanceModal(): void {
        this.showAttendanceModal.set(true);
        this.saveMessage.set('');
    }

    closeAttendanceModal(): void {
        this.showAttendanceModal.set(false);
    }
}
