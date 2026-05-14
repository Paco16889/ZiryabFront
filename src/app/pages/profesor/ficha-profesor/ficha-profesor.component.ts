import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { StudentAbsencesModalComponent } from './student-absences-modal/student-absences-modal.component';
import { AssistanceService } from '../../../core/services/alumno/assistance.service';
import { AssistanceItem } from '../../../core/models/assistance';
import { environment } from '../../../../environments/environment';

/**
 * Componente que muestra las faltas pendientes de justificar enviadas por los alumnos al profesor.
 * Permite visualizar el justificante y aceptar o rechazar la justificación.
 */
@Component({
  selector: 'app-ficha-profesor',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, StudentAbsencesModalComponent],
  templateUrl: './ficha-profesor.component.html',
  styleUrl: './ficha-profesor.component.scss'
})
export class FichaProfesorComponent implements OnInit {

  /** Servicio para gestionar las operaciones de asistencia */
  private assistanceService = inject(AssistanceService);

  /** Signal que indica si los datos están cargándose */
  public loading = signal<boolean>(true);
  /** Signal para almacenar mensajes de error o información */
  public statusMessage = signal<{text: string, type: 'error' | 'success' | 'info'} | null>(null);

  /** Signal que contiene el listado de faltas pendientes de revisión */
  public justificacionesPendientes = signal<AssistanceItem[]>([]);

  /** Estado del modal de ausencias */
  public isAbsencesModalOpen = signal<boolean>(false);

  public apiUrl = environment.apiUrl;

  /**
   * Ciclo de vida: Inicializa el componente cargando las faltas pendientes.
   */
  ngOnInit(): void {
    this.cargarJustificacionesPendientes();
  }

  /**
   * Obtiene todas las asistencias del profesor y filtra aquellas
   * que tengan un archivo adjunto pero que aún no hayan sido justificadas.
   */
  cargarJustificacionesPendientes(): void {
    this.loading.set(true);
    this.assistanceService.getAllAssistances().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Filtrar faltas que tengan un justificante enviado o estén en estado PENDING, sin comprobar EXCUSED ni ABSENT por ahora para depurar.
          const pendientes = res.data.filter(a => 
            a.justificationUri || a.justificationStatus === 'PENDING'
          );
          this.justificacionesPendientes.set(pendientes);
          
          if (pendientes.length === 0) {
            this.statusMessage.set({text: 'No tienes justificaciones pendientes de revisar.', type: 'info'});
          } else {
            this.statusMessage.set(null);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar justificaciones', err);
        this.statusMessage.set({text: 'Error al cargar las justificaciones pendientes.', type: 'error'});
        this.loading.set(false);
      }
    });
  }

  /**
   * Abre el archivo adjunto en una pestaña nueva.
   * @param uri Ruta relativa del archivo.
   */
  verJustificante(uri: string): void {
    // Si la uri ya empieza por http, se abre tal cual. Si no, se concatena con la apiUrl
    const fullUrl = uri.startsWith('http') ? uri : `${this.apiUrl.replace('/api', '')}${uri}`;
    window.open(fullUrl, '_blank');
  }

  /**
   * Acepta la justificación, cambiando el estado de la falta a EXCUSED.
   * @param assistanceId Identificador de la falta.
   */
  aceptarJustificacion(assistanceId: number): void {
    this.loading.set(true);
    this.assistanceService.justifyAbsence(assistanceId).subscribe({
      next: (res) => {
        if (res.success) {
          this.statusMessage.set({text: 'Falta justificada correctamente.', type: 'success'});
          // Eliminar de la lista local
          this.justificacionesPendientes.update(list => list.filter(a => a.id !== assistanceId));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al justificar', err);
        this.statusMessage.set({text: 'Hubo un error al intentar justificar la falta.', type: 'error'});
        this.loading.set(false);
      }
    });
  }

  /**
   * Rechaza la justificación, manteniendo la falta como ABSENT.
   * @param assistanceId Identificador de la falta.
   */
  rechazarJustificacion(assistanceId: number): void {
    this.loading.set(true);
    this.assistanceService.rejectJustification(assistanceId).subscribe({
      next: (res) => {
        if (res.success) {
          this.statusMessage.set({text: 'Justificante rechazado.', type: 'info'});
          // Eliminar de la lista local ya que ya ha sido revisada (asumiremos que rechazarla cambia algo,
          // o simplemente la quitamos de la vista. Para ser correctos, idealmente el status pasaría a un estado REJECTED,
          // pero si vuelve a ABSENT igual se muestra en la lista.
          // Para evitar que vuelva a aparecer, el backend requeriría un 'justificationStatus = REJECTED'.
          // Si el backend no tiene esto, la retiramos de la vista y ya.
          this.justificacionesPendientes.update(list => list.filter(a => a.id !== assistanceId));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al rechazar', err);
        this.statusMessage.set({text: 'Hubo un error al intentar rechazar el justificante.', type: 'error'});
        this.loading.set(false);
      }
    });
  }
}
