import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { AuthService } from '../../../core/services/auth.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AttendanceService, AttendanceRecord, AttendanceStatus } from '../../../core/services/attendance.service';

/**
 * Componente que muestra el temario de una asignatura organizado por unidades.
 * Para los profesores incluye además un apartado de "Pasar lista" donde pueden
 * registrar la asistencia de todos los alumnos matriculados en la asignatura.
 */
@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './temario.component.html',
  styleUrls: ['./temario.component.scss'] 
})
export class TemarioComponent implements OnInit {

  private route           = inject(ActivatedRoute);
  private authService     = inject(AuthService);
  private clasesService   = inject(ClasesService);
  private attendanceSvc   = inject(AttendanceService);

  // ── Temario ──────────────────────────────────────────────────────────────

  /**
   * Listado de unidades didácticas con sus temas.
   * Datos mockeados, pendiente de sustituir por datos reales del backend.
   */
  unidades = [
    { id: 1, titulo: 'Conceptos Básicos',    abierta: true,  temas: ['1. Variables y tipos de datos primitivos', '2. Operadores aritméticos y de asignación', '3. Entrada y salida de datos por consola'] },
    { id: 2, titulo: 'Control de Flujo',     abierta: false, temas: ['1. Estructuras condicionales (if, else, switch)', '2. Operadores lógicos y relacionales', '3. Manejo de errores básicos'] },
    { id: 3, titulo: 'Bucles e Iteraciones', abierta: false, temas: ['1. Bucle For y sus variantes', '2. Bucles While y Do-While', '3. Break y Continue: Controlando el ciclo'] },
    { id: 4, titulo: 'Funciones',            abierta: false, temas: ['1. Declaración y expresión de funciones', '2. Parámetros, argumentos y retorno', '3. Scope (Alcance) de variables'] },
  ];

  // ── Pasar lista ───────────────────────────────────────────────────────────

  /** Si el usuario autenticado es profesor. */
  readonly isTeacher = computed(() => this.authService.getUserRole() === 'TEACHER');

  /** Id de la asignatura recibido como query param. */
  subjectId: number | null = null;

  /** Lista de alumnos matriculados en la asignatura con sus datos de matrícula. */
  alumnos = signal<any[]>([]);

  /** Mapa enrollmentId → estado de asistencia seleccionado. */
  attendanceMap: Record<number, AttendanceStatus> = {};

  /** Set de enrollmentIds que el profesor ha revisado explícitamente. */
  private reviewedIds = signal<Set<number>>(new Set<number>());

  /**
   * Número de alumnos que ya han sido revisados.
   * Útil para mostrar el progreso en la UI.
   */
  readonly revisadosCount = computed(() => this.reviewedIds().size);

  /**
   * `true` cuando el profesor ha asignado un estado a todos los alumnos.
   * El formulario no puede enviarse hasta que este valor sea `true`.
   */
  readonly todosRevisados = computed(
    () => this.alumnos().length > 0 && this.reviewedIds().size === this.alumnos().length
  );

  /** Indica si se está cargando la lista de alumnos. */
  loadingAlumnos = signal(false);

  /** Indica si se está guardando la asistencia. */
  saving = signal(false);

  /** Mensaje a mostrar tras guardar (éxito o error). */
  saveMessage = signal('');

  /** Si el mensaje de guardado es un error. */
  saveError = signal(false);

  /**
   * Controla la visibilidad del toast de éxito flotante.
   * Se pone a `true` tras guardar correctamente y vuelve a `false`
   * al cabo de {@link TOAST_DURATION_MS} milisegundos.
   */
  showSuccessToast = signal(false);

  /** Temporizador interno para el auto-dismiss del toast. */
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  /** Duración en ms del toast de éxito antes de ocultarse. */
  private readonly TOAST_DURATION_MS = 4000;

  /** Opciones de estado que el profesor puede asignar. */
  readonly statusOptions: { value: AttendanceStatus; label: string; color: string }[] = [
    { value: 'PRESENT', label: 'Presente',    color: 'emerald' },
    { value: 'ABSENT',  label: 'Ausente',     color: 'red'     },
    { value: 'LATE',    label: 'Retraso',     color: 'amber'   },
    { value: 'EXCUSED', label: 'Justificado', color: 'blue'    },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /** @inheritdoc */
  ngOnInit(): void {
    const param = this.route.snapshot.queryParamMap.get('subjectId');
    if (param) {
      this.subjectId = Number(param);
    }

    if (this.isTeacher() && this.subjectId) {
      this.loadAlumnos();
    }
  }

  // ── Métodos de temario ────────────────────────────────────────────────────

  /**
   * Alterna el estado abierto o cerrado de una unidad didáctica.
   * Solo permite tener una unidad abierta a la vez.
   * @param id - Identificador de la unidad a alternar
   * @returns {void}
   */
  toggleUnidad(id: number): void {
    this.unidades = this.unidades.map(u => ({
      ...u,
      abierta: u.id === id ? !u.abierta : false,
    }));
  }

  // ── Métodos de asistencia ─────────────────────────────────────────────────

  /**
   * Carga los alumnos matriculados en la asignatura desde el backend.
   * @returns {void}
   */
  private loadAlumnos(): void {
    this.loadingAlumnos.set(true);
    this.clasesService.getStudentsBySubject(this.subjectId!).subscribe({
      next: (data) => {
        this.alumnos.set(data);
        // No pre-asignamos ningún estado: el profesor debe revisar a cada alumno.
        this.attendanceMap = {};
        this.reviewedIds.set(new Set<number>());
        this.loadingAlumnos.set(false);
      },
      error: () => {
        this.loadingAlumnos.set(false);
      }
    });
  }

  /**
   * Cambia el estado de asistencia de un alumno en el mapa local.
   * @param enrollmentId - Identificador de la matrícula del alumno
   * @param status - Nuevo estado de asistencia
   * @returns {void}
   */
  setStatus(enrollmentId: number, status: AttendanceStatus): void {
    this.attendanceMap = { ...this.attendanceMap, [enrollmentId]: status };
    // Marcar al alumno como revisado
    const updated = new Set(this.reviewedIds());
    updated.add(enrollmentId);
    this.reviewedIds.set(updated);
  }

  /**
   * Guarda la asistencia de todos los alumnos.
   * Primero obtiene o crea la sesión del día y luego envía el bulk de registros.
   * @returns {void}
   */
  guardarAsistencia(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.subjectId || !this.todosRevisados()) return;

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
            this.saveMessage.set('');
            this.showToast();
            this.resetForm();
          },
          error: () => {
            this.saving.set(false);
            this.saveError.set(true);
            this.saveMessage.set('❌ Error al guardar la asistencia');
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

  // ── Helpers privados ──────────────────────────────────────────────────────

  /**
   * Muestra el toast de éxito y programa su ocultación automática.
   * Si ya había un toast visible reinicia el temporizador.
   */
  private showToast(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.showSuccessToast.set(true);
    this.toastTimer = setTimeout(() => {
      this.showSuccessToast.set(false);
      this.toastTimer = null;
    }, this.TOAST_DURATION_MS);
  }

  /**
   * Resetea el formulario de asistencia al estado inicial.
   * Limpia el mapa de estados y el set de revisados para que
   * el profesor no pueda re-enviar la misma sesión accidentalmente.
   */
  private resetForm(): void {
    this.attendanceMap = {};
    this.reviewedIds.set(new Set<number>());
  }
}