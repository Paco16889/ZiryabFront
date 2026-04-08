import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { AuthService } from '../../../core/services/auth.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AttendanceService, AttendanceRecord, AttendanceStatus } from '../../../core/services/attendance.service';

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

    unidades = [
        { id: 1, titulo: 'Conceptos Básicos', abierta: true, temas: ['1. Variables y tipos de datos primitivos', '2. Operadores aritméticos y de asignación', '3. Entrada y salida de datos por consola'] },
        { id: 2, titulo: 'Control de Flujo', abierta: false, temas: ['1. Estructuras condicionales (if, else, switch)', '2. Operadores lógicos y relacionales', '3. Manejo de errores básicos'] },
        { id: 3, titulo: 'Bucles e Iteraciones', abierta: false, temas: ['1. Bucle For y sus variantes', '2. Bucles While y Do-While', '3. Break y Continue: Controlando el ciclo'] },
        { id: 4, titulo: 'Funciones', abierta: false, temas: ['1. Declaración y expresión de funciones', '2. Parámetros, argumentos y retorno', '3. Scope (Alcance) de variables'] },
    ];

    subjectId: number | null = null;
    alumnos = signal<any[]>([]);
    attendanceMap: Record<number, AttendanceStatus> = {};
    loadingAlumnos = signal(false);
    saving = signal(false);
    saveMessage = signal('');
    saveError = signal(false);

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
    }

    toggleUnidad(id: number): void {
        this.unidades = this.unidades.map(u => ({
            ...u,
            abierta: u.id === id ? !u.abierta : false,
        }));
    }

    private loadAlumnos(): void {
        this.loadingAlumnos.set(true);
        this.clasesService.getStudentsBySubject(this.subjectId!).subscribe({
            next: (data) => {
                this.alumnos.set(data);
                data.forEach((alumno: any) => {
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
                        this.saveMessage.set('✅ Asistencia guardada correctamente');
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
}
