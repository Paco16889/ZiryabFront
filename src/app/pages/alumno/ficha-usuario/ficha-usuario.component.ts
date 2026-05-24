import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { JustificarFaltaModalComponent } from './justificar-falta-modal/justificar-falta-modal.component';
import { AssistanceService } from '../../../core/services/alumno/assistance.service';
import { AuthService } from '../../../core/services/auth.service';
import { AssistanceItem } from '../../../core/models/assistance';

/**
 * Componente que muestra la ficha de asistencia del estudiante.
 * Carga las faltas desde el backend y permite enviar justificantes mediante el modal.
 */
@Component({
  selector: 'app-ficha-usuario',
  standalone: true,
  imports: [NgClass, DatePipe, BotonAtrasComponent, JustificarFaltaModalComponent, TranslateModule],
  templateUrl: './ficha-usuario.component.html',
  styleUrl: './ficha-usuario.component.scss'
})
export class FichaUsuarioComponent implements OnInit {

  /** Servicio para gestionar las operaciones de asistencia */
  private assistanceService = inject(AssistanceService);
  /** Servicio para gestionar la autenticación y obtener el usuario actual */
  private authService = inject(AuthService);
  /** Traducciones de errores al cargar faltas o identificar al alumno. */
  private translate = inject(TranslateService);

  /** Signal que indica si los datos están cargándose */
  public loading = signal<boolean>(true);
  /** Signal para almacenar mensajes de error durante la carga */
  public errorMessage = signal<string>('');

  /** Signal que controla la visibilidad del modal de justificación */
  public isJustificarModalOpen = signal<boolean>(false);
  /** Signal que almacena la falta seleccionada para justificar */
  public faltaSeleccionada = signal<AssistanceItem | null>(null);

  /** Signal que contiene el listado de faltas de asistencia del alumno */
  public faltas = signal<AssistanceItem[]>([]);

  /**
   * Ciclo de vida: Inicializa el componente cargando el historial de faltas.
   */
  ngOnInit(): void {
    this.cargarFaltas();
  }

  /**
   * Obtiene las faltas del estudiante identificado mediante el servicio de asistencia.
   */
  cargarFaltas(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.loading.set(true);
      this.assistanceService.getAssistancesByStudentId(user.id).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.faltas.set(res.data);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar faltas', err);
          this.errorMessage.set(this.translate.instant('common.errors.loadAbsences'));
          this.loading.set(false);
        }
      });
    } else {
      this.errorMessage.set(this.translate.instant('common.errors.userNotIdentified'));
      this.loading.set(false);
    }
  }

  /**
   * Gestiona el clic en una falta específica del listado.
   * Si la falta no está ya justificada, abre el modal de justificación.
   * @param falta Objeto de asistencia pulsado.
   */
  onFaltaClick(falta: AssistanceItem): void {
    if (falta.status !== 'EXCUSED') {
      this.faltaSeleccionada.set(falta);
      this.isJustificarModalOpen.set(true);
    }
  }

  /**
   * Callback ejecutado cuando un justificante se envía con éxito desde el modal.
   * @param assistanceId Identificador de la falta justificada.
   */
  onJustifySuccess(_assistanceId: number): void {
    this.isJustificarModalOpen.set(false);
    this.faltaSeleccionada.set(null);
    this.cargarFaltas();
  }
}