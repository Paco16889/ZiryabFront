import { Component, EventEmitter, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssistanceService } from '../../../../core/services/alumno/assistance.service';
import { resolveApiError } from '../../../../core/i18n/api-error.util';

/** Resumen de ausencias de un alumno agrupadas por asignatura. */
interface StudentAbsencesData {
  /** Alumno al que pertenecen las ausencias. */
  student: { id: number; name: string; surname: string; email: string; };
  /** Ausencias por asignatura. */
  subjects: { subjectName: string; absences: number; }[];
  /** Total de ausencias del alumno. */
  totalAbsences: number;
}

/** Modal de profesor que muestra ausencias de sus alumnos. */
@Component({
  selector: 'app-student-absences-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex min-h-full items-end justify-center p-0 text-center sm:min-h-screen sm:items-center sm:p-4">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" (click)="onClose()"></div>

        <div class="relative flex w-full max-h-[92dvh] max-w-3xl flex-col overflow-hidden bg-white text-left align-middle shadow-2xl sm:max-h-[85vh] sm:rounded-2xl rounded-t-2xl">
          <!-- Modal Header -->
          <div class="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 bg-slate-50/50 px-4 py-3 sm:items-center sm:px-6 sm:py-4">
            <h3 class="min-w-0 flex-1 text-lg font-semibold leading-snug text-slate-800 sm:text-xl" id="modal-title">
              {{ 'teacherProfile.absencesSummary.title' | translate }}
            </h3>
            <button (click)="onClose()" class="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <span class="sr-only">{{ 'common.buttons.close' | translate }}</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            @if (loading()) {
              <div class="flex flex-col items-center justify-center py-10 sm:py-12">
                <div class="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"></div>
                <p class="font-medium text-slate-500">{{ 'teacherProfile.absencesSummary.loading' | translate }}</p>
              </div>
            } @else if (error()) {
              <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:text-base">
                {{ error() }}
              </div>
            } @else if (studentsData().length === 0) {
              <div class="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 sm:p-8 sm:text-base">
                {{ 'teacherProfile.absencesSummary.empty' | translate }}
              </div>
            } @else {
              <!-- Móvil: tarjetas por alumno -->
              <ul class="space-y-3 md:hidden" role="list">
                @for (item of studentsData(); track item.student.id) {
                  <li class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div class="flex items-start gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                        {{ item.student.name.charAt(0) }}{{ item.student.surname.charAt(0) }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <div>
                          <p class="truncate text-sm font-semibold text-gray-900">
                            {{ item.student.name }} {{ item.student.surname }}
                          </p>
                          <p class="truncate text-xs text-gray-500">{{ item.student.email }}</p>
                        </div>
                        <ul class="mt-3 space-y-2 border-t border-gray-100 pt-3">
                          @for (subj of item.subjects; track subj.subjectName) {
                            <li class="flex items-center justify-between gap-3 text-sm">
                              <span class="min-w-0 flex-1 truncate text-gray-600">{{ subj.subjectName }}</span>
                              <span
                                class="shrink-0 font-medium tabular-nums"
                                [ngClass]="subj.absences > 0 ? 'text-red-500' : 'text-gray-500'"
                              >
                                {{ subj.absences }}
                              </span>
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                  </li>
                }
              </ul>

              <!-- Escritorio: tabla -->
              <div class="hidden overflow-hidden rounded-xl border border-gray-200 shadow-sm md:block">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ 'teacherProfile.absencesSummary.student' | translate }}</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{{ 'teacherProfile.absencesSummary.subjects' | translate }}</th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">{{ 'teacherProfile.absencesSummary.absencesPerSubject' | translate }}</th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">{{ 'teacherProfile.absencesSummary.totalAbsences' | translate }}</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      @for (item of studentsData(); track item.student.id) {
                        <tr class="transition-colors hover:bg-slate-50">
                          <td class="whitespace-nowrap px-6 py-4">
                            <div class="flex items-center">
                              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                                {{ item.student.name.charAt(0) }}{{ item.student.surname.charAt(0) }}
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">{{ item.student.name }} {{ item.student.surname }}</div>
                                <div class="text-sm text-gray-500">{{ item.student.email }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="whitespace-nowrap px-6 py-4">
                            <ul class="space-y-1 text-sm text-gray-500">
                              @for (subj of item.subjects; track subj.subjectName) {
                                <li>{{ subj.subjectName }}</li>
                              }
                            </ul>
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 text-center">
                            <ul class="space-y-1 text-sm text-gray-500">
                              @for (subj of item.subjects; track subj.subjectName) {
                                <li>
                                  <span class="font-medium" [ngClass]="{'text-red-500': subj.absences > 0}">{{ subj.absences }}</span>
                                </li>
                              }
                            </ul>
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 text-center">
                            <span
                              class="inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5"
                              [ngClass]="item.totalAbsences === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                            >
                              {{ item.totalAbsences }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>

          <!-- Modal Footer -->
          <div class="flex shrink-0 justify-end rounded-b-2xl bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
            <button
              (click)="onClose()"
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto sm:py-2"
            >
              {{ 'common.buttons.close' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentAbsencesModalComponent implements OnInit {
  /** Evento de cierre del modal. */
  @Output() closeModal = new EventEmitter<void>();

  /** Servicio que consulta ausencias de alumnos del profesor. */
  private assistanceService = inject(AssistanceService);
  /** Traducciones de estados y errores. */
  private translate = inject(TranslateService);

  /** Datos de alumnos con ausencias. */
  studentsData = signal<StudentAbsencesData[]>([]);
  /** Estado de carga. */
  loading = signal<boolean>(true);
  /** Error visible. */
  error = signal<string | null>(null);

  /** Carga datos al abrir el modal. */
  ngOnInit() {
    this.loadData();
  }

  /** Consulta el resumen de ausencias del profesor autenticado. */
  loadData() {
    this.loading.set(true);
    this.error.set(null);
    this.assistanceService.getStudentsAbsences<StudentAbsencesData[]>().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.studentsData.set(res.data);
        } else {
          this.error.set(this.translate.instant('teacherProfile.absencesSummary.loadError'));
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(resolveApiError(this.translate, err, 'teacherProfile.absencesSummary.fetchError'));
        this.loading.set(false);
      }
    });
  }

  /** Emite cierre al contenedor padre. */
  onClose() {
    this.closeModal.emit();
  }
}
