import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { AuthService } from '../../../core/services/auth.service';
import { CargaStudentsporGrupoAsignaturaService } from '../../../core/services/profesor/carga-studentspor-grupo-asignatura.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { AttendanceService, AttendanceRecord, AttendanceStatus } from '../../../core/services/attendance.service';
import { TaskService } from '../../../core/services/profesor/task.service';
import { Task, TaskType } from '../../../core/models/teacher/tasks';

import { Router } from '@angular/router';
import { StudentBySubject } from '../../../core/models/student-by-subject';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/** Bloque del temario agrupado por tipo de tarea (examen, práctica, etc.). */
export interface BloqueTemario {
  /** Identificador local del bloque para alternar su apertura. */
  id: number;
  /** Clave i18n del título del bloque. */
  titleKey: string;
  /** Indica si el acordeón está abierto. */
  abierta: boolean;
  /** Icono ilustrativo del bloque. */
  icono: string;
  /** Tareas agrupadas en el bloque. */
  tareas: Task[];
}

/** Temario del profesor con tareas por tipo y gestión rápida de asistencia. */
@Component({
    selector: 'app-temario-profesor',
    standalone: true,
    imports: [CommonModule, BotonAtrasComponent, TranslateModule],
    templateUrl: './temario-profesor.component.html',
    styleUrls: ['./temario-profesor.component.scss']
})
export class TemarioProfesorComponent implements OnInit {

    /** Ruta activa con asignatura y subjectId. */
    private route = inject(ActivatedRoute);
    /** Servicio de sesión para identificar al profesor. */
    private authService = inject(AuthService);
    /** Matrículas por grupo y asignatura (sustitución). */
    private studentsByGroup = inject(CargaStudentsporGrupoAsignaturaService);
    /** Asignaciones titulares + sustituciones activas. */
    private teachingContext = inject(TeacherTeachingContextService);
    /** Servicio de asistencia para crear sesión y guardar registros. */
    private attendanceSvc = inject(AttendanceService);
    /** Servicio de tareas para cargar el temario. */
    private taskService = inject(TaskService);
    /** Router para navegar a entregas. */
    private router = inject(Router);
    /** Traducciones de mensajes. */
    private readonly translate = inject(TranslateService);

    /** Bloques de tareas agrupados por tipo. */
    bloques = signal<BloqueTemario[]>([]);
    /** Nombre de asignatura recibido por ruta. */
    claseEnCurso = decodeURIComponent(this.route.snapshot.paramMap.get('claseId') || '');

    /** Identificador de asignatura usado para cargar alumnos. */
    subjectId: number | null = null;
    /** Asignación docente concreta (titular o sustitución). */
    assignmentId: number | null = null;
    /** Alumnos matriculados en la asignatura. */
    alumnos = signal<StudentBySubject[]>([]);
    /** Error al cargar tareas del temario. */
    tasksLoadError = signal(false);
    /** Estado de asistencia seleccionado por matrícula. */
    attendanceMap: Record<number, AttendanceStatus> = {};
    /** Estado de carga de alumnos. */
    loadingAlumnos = signal(false);
    /** Estado de guardado de asistencia. */
    saving = signal(false);
    /** Mensaje de resultado de guardado. */
    saveMessage = signal('');
    /** Indica si el último guardado de asistencia falló. */
    saveError = signal(false);
    /** Controla el modal de asistencia. */
    showAttendanceModal = signal(false);

    readonly statusOptions: { value: AttendanceStatus; labelKey: string; color: string }[] = [
        { value: 'PRESENT', labelKey: 'teacherPages.attendance.status.present', color: 'emerald' },
        { value: 'ABSENT', labelKey: 'teacherPages.attendance.status.absent', color: 'red' },
        { value: 'LATE', labelKey: 'teacherPages.attendance.status.late', color: 'amber' },
        { value: 'EXCUSED', labelKey: 'teacherPages.attendance.status.excused', color: 'blue' },
    ];

    /** Carga subjectId, alumnos y tareas al montar el temario. */
    ngOnInit(): void {
        const subjectParam = this.route.snapshot.queryParamMap.get('subjectId');
        const assignmentParam = this.route.snapshot.queryParamMap.get('assignmentId');
        if (subjectParam) {
            this.subjectId = Number(subjectParam);
        }
        if (assignmentParam) {
            this.assignmentId = Number(assignmentParam);
        }
        if (!this.assignmentId) {
            this.tasksLoadError.set(true);
            return;
        }
        this.loadAlumnos();
        this.loadTasks();
    }

    /** Carga tareas de la asignación docente (titular o sustituto). */
    loadTasks() {
      if (!this.assignmentId) {
        return;
      }
      this.taskService.getTasksByAssignment(this.assignmentId).subscribe({
        next: (res) => {
          if (res.success) {
            this.groupTasksByType(res.data);
          }
        },
        error: (err) => {
          console.error(err);
          this.tasksLoadError.set(true);
        },
      });
    }

    /** Agrupa tareas por tipo de la asignación actual. */
    groupTasksByType(tasks: Task[]) {
      const configBloques: { tipo: TaskType; titleKey: string; icono: string }[] = [
        { tipo: 'THEORY', titleKey: 'teacherPages.syllabus.blocks.theory', icono: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
        { tipo: 'EXAM', titleKey: 'teacherPages.syllabus.blocks.exam', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362402.png' },
        { tipo: 'PROJECT', titleKey: 'teacherPages.syllabus.blocks.project', icono: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
        { tipo: 'PRACTICE', titleKey: 'teacherPages.syllabus.blocks.practice', icono: 'https://cdn-icons-png.flaticon.com/512/471/471495.png' },
        { tipo: 'HOMEWORK', titleKey: 'teacherPages.syllabus.blocks.homework', icono: 'https://cdn-icons-png.flaticon.com/512/3362/3362369.png' },
      ];

      const nuevosBloques: BloqueTemario[] = [];
      for (const conf of configBloques) {
        const tareasDeTipo = tasks.filter(
          (t) => t.type === conf.tipo && t.teacherAssignment?.id === this.assignmentId,
        );
        
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

    /** Alterna el acordeón de un bloque de tareas. */
    toggleBloque(id: number): void {
        this.bloques.update(bs => bs.map(b => ({
            ...b,
            abierta: b.id === id ? !b.abierta : b.abierta
        })));
    }

    /** Navega al listado de entregas de una tarea. */
    goToEntregas(taskId: number): void {
      this.router.navigate(['/tarea', taskId, 'entregas']);
    }

    /** Carga alumnos de la asignatura para registrar asistencia. */
    private loadAlumnos(): void {
        this.loadingAlumnos.set(true);
        const user = this.authService.getCurrentUser();
        if (!user?.id || !this.assignmentId) {
            this.loadingAlumnos.set(false);
            return;
        }

        this.teachingContext.ensureLoaded(user.id).subscribe({
            next: (rows) => {
                const row = rows.find((r) => r.id === this.assignmentId);
                if (!row?.idGroup) {
                    this.loadingAlumnos.set(false);
                    return;
                }
                this.studentsByGroup.getEnrollmentsByFilters({
                    idSubject: row.idSubject,
                    idGroup: row.idGroup,
                    schoolYear: row.schoolYear,
                }).subscribe({
                    next: (response) => {
                        if (response.success) {
                            const mapped: StudentBySubject[] = response.data.map((e) => ({
                                enrollmentId: e.id,
                                studentId: e.student.id,
                                name: e.student.name,
                                surname: e.student.surname ?? '',
                                groupId: e.idGroup,
                                groupName: row.group?.name ?? '',
                            }));
                            this.alumnos.set(mapped);
                            mapped.forEach((alumno) => {
                                this.attendanceMap[alumno.enrollmentId] = 'PRESENT';
                            });
                        }
                        this.loadingAlumnos.set(false);
                    },
                    error: () => this.loadingAlumnos.set(false),
                });
            },
            error: () => this.loadingAlumnos.set(false),
        });
    }

    /** Cambia el estado de asistencia de una matrícula. */
    setStatus(enrollmentId: number, status: AttendanceStatus): void {
        this.attendanceMap = { ...this.attendanceMap, [enrollmentId]: status };
    }

    /** Crea una sesión y guarda en bloque la asistencia seleccionada. */
    guardarAsistencia(): void {
        const user = this.authService.getCurrentUser();
        if (!user || !this.subjectId) return;

        this.saving.set(true);
        this.saveMessage.set('');

        const teacherId = this.teachingContext.resolveTeacherIdForApi(user.id, {
          assignmentId: this.assignmentId ?? undefined,
        });
        this.attendanceSvc.startSession(this.subjectId, teacherId).subscribe({
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
                        this.saveMessage.set(this.translate.instant('teacherPages.syllabus.attendanceSaved'));
                        setTimeout(() => {
                            this.closeAttendanceModal();
                        }, 1500);
                    },
                    error: () => {
                        this.saving.set(false);
                        this.saveError.set(true);
                        this.saveMessage.set(this.translate.instant('teacherPages.syllabus.attendanceSaveError'));
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

    /** Abre el modal de asistencia limpiando mensajes previos. */
    openAttendanceModal(): void {
        this.showAttendanceModal.set(true);
        this.saveMessage.set('');
    }

    /** Cierra el modal de asistencia. */
    closeAttendanceModal(): void {
        this.showAttendanceModal.set(false);
    }
}
