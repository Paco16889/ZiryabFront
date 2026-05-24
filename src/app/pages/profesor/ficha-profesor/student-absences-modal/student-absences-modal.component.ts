import { Component, EventEmitter, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssistanceService } from '../../../../core/services/alumno/assistance.service';
import { resolveApiError } from '../../../../core/i18n/api-error.util';

interface StudentAbsencesData {
  student: { id: number; name: string; surname: string; email: string; };
  subjects: { subjectName: string; absences: number; }[];
  totalAbsences: number;
}

@Component({
  selector: 'app-student-absences-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" (click)="onClose()"></div>

        <div class="relative inline-block w-full max-w-3xl overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
            <h3 class="text-xl font-semibold text-slate-800" id="modal-title">
              {{ 'teacherProfile.absencesSummary.title' | translate }}
            </h3>
            <button (click)="onClose()" class="p-2 transition-colors rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <span class="sr-only">{{ 'common.buttons.close' | translate }}</span>
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            @if (loading()) {
              <div class="flex flex-col items-center justify-center py-12">
                <div class="w-10 h-10 mb-4 border-4 border-t-indigo-600 border-indigo-100 rounded-full animate-spin"></div>
                <p class="font-medium text-slate-500">{{ 'teacherProfile.absencesSummary.loading' | translate }}</p>
              </div>
            } @else if (error()) {
              <div class="p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {{ error() }}
              </div>
            } @else if (studentsData().length === 0) {
              <div class="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
                {{ 'teacherProfile.absencesSummary.empty' | translate }}
              </div>
            } @else {
              <div class="overflow-hidden border border-gray-200 shadow-sm rounded-xl">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">{{ 'teacherProfile.absencesSummary.student' | translate }}</th>
                      <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">{{ 'teacherProfile.absencesSummary.subjects' | translate }}</th>
                      <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">{{ 'teacherProfile.absencesSummary.absencesPerSubject' | translate }}</th>
                      <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">{{ 'teacherProfile.absencesSummary.totalAbsences' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (item of studentsData(); track item.student.id) {
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                              {{ item.student.name.charAt(0) }}{{ item.student.surname.charAt(0) }}
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ item.student.name }} {{ item.student.surname }}</div>
                              <div class="text-sm text-gray-500">{{ item.student.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <ul class="text-sm text-gray-500 space-y-1">
                            @for (subj of item.subjects; track subj.subjectName) {
                              <li>
                                {{ subj.subjectName }}
                              </li>
                            }
                          </ul>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                          <ul class="text-sm text-gray-500 space-y-1">
                            @for (subj of item.subjects; track subj.subjectName) {
                              <li>
                                <span class="font-medium" [ngClass]="{'text-red-500': subj.absences > 0}">{{ subj.absences }}</span>
                              </li>
                            }
                          </ul>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                          <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                                [ngClass]="item.totalAbsences === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ item.totalAbsences }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end">
            <button (click)="onClose()" class="px-4 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              {{ 'common.buttons.close' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentAbsencesModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  private assistanceService = inject(AssistanceService);
  private translate = inject(TranslateService);

  studentsData = signal<StudentAbsencesData[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

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

  onClose() {
    this.closeModal.emit();
  }
}
