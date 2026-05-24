import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { AuthService } from '../../../core/services/auth.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AttendanceService, AttendanceRecord, AttendanceStatus } from '../../../core/services/attendance.service';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskType } from '../../../core/models/task';
import { Router } from '@angular/router';
import { StudentBySubject } from '../../../core/models/student-by-subject';
import { resolveApiError } from '../../../core/i18n/api-error.util';

export interface BloqueTemario {
  id: number;
  titleKey: string;
  abierta: boolean;
  icono: string;
  tareas: Task[];
}

@Component({
    selector: 'app-temario-profesor',
    standalone: true,
    imports: [CommonModule, BotonAtrasComponent, TranslateModule],
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
    private readonly translate = inject(TranslateService);

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

    readonly statusOptions: { value: AttendanceStatus; labelKey: string; color: string }[] = [
        { value: 'PRESENT', labelKey: 'assistanceStatus.PRESENT', color: 'emerald' },
        { value: 'ABSENT', labelKey: 'assistanceStatus.ABSENT', color: 'red' },
        { value: 'LATE', labelKey: 'assistanceStatus.LATE', color: 'amber' },
        { value: 'EXCUSED', labelKey: 'assistanceStatus.EXCUSED', color: 'blue' },
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
        { tipo: TaskType.THEORY, titleKey: 'syllabus.sections.THEORY', icono: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
        { tipo: TaskType.EXAM, titleKey: 'syllabus.sections.EXAM', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362402.png' },
        { tipo: TaskType.PROJECT, titleKey: 'syllabus.sections.PROJECT', icono: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
        { tipo: TaskType.PRACTICE, titleKey: 'syllabus.sections.PRACTICE', icono: 'https://cdn-icons-png.flaticon.com/512/471/471495.png' },
        { tipo: TaskType.HOMEWORK, titleKey: 'syllabus.sections.HOMEWORK', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362369.png' }
      ];

      const nuevosBloques: BloqueTemario[] = [];
      const user = this.authService.getCurrentUser();
      for (const conf of configBloques) {
        const tareasDeTipo = tasks.filter(t => t.type === conf.tipo && t.teacherAssignment?.idTeacher === user?.id);
        
        if (tareasDeTipo.length > 0) {
          tareasDeTipo.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          nuevosBloques.push({
            id: nuevosBloques.length + 1,
            titleKey: conf.titleKey,
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
                        this.saveMessage.set(this.translate.instant('syllabus.attendanceSaved'));
                        setTimeout(() => {
                            this.closeAttendanceModal();
                        }, 1500);
                    },
                    error: () => {
                        this.saving.set(false);
                        this.saveError.set(true);
                        this.saveMessage.set(this.translate.instant('common.errors.saveAttendance'));
                    }
                });
            },
            error: (err) => {
                this.saving.set(false);
                this.saveError.set(true);
                this.saveMessage.set(resolveApiError(this.translate, err, 'common.errors.sessionError'));
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
