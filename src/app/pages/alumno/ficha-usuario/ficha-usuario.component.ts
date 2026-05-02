import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { JustificarFaltaModalComponent } from './justificar-falta-modal/justificar-falta-modal.component';
import { AssistanceService } from '../../../core/services/alumno/assistance.service';
import { AuthService } from '../../../core/services/auth.service';
import { AssistanceItem } from '../../../core/models/assistance';

/**
 * Componente que muestra la ficha de asistencia del estudiante.
 * Actualmente contiene datos mockeados a la espera de integrarse con el backend.
 * Permite alternar entre la vista de faltas y la vista de justificación.
 * componente pendiente de implementación real, ver issues.
 */
@Component({
  selector: 'app-ficha-usuario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, JustificarFaltaModalComponent],
  templateUrl: './ficha-usuario.component.html',
  styleUrl: './ficha-usuario.component.scss'
})
export class FichaUsuarioComponent implements OnInit {

  private assistanceService = inject(AssistanceService);
  private authService = inject(AuthService);

  public loading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  // Estados del modal de justificación
  public isJustificarModalOpen = signal<boolean>(false);
  public faltaSeleccionada = signal<AssistanceItem | null>(null);

  // Lista plana de faltas
  public faltas = signal<AssistanceItem[]>([]);

  ngOnInit(): void {
    this.cargarFaltas();
  }

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
          this.errorMessage.set('Error al cargar las faltas.');
          this.loading.set(false);
        }
      });
    } else {
      this.errorMessage.set('Usuario no identificado.');
      this.loading.set(false);
    }
  }

  onFaltaClick(falta: AssistanceItem): void {
    if (falta.status !== 'EXCUSED') {
      this.faltaSeleccionada.set(falta);
      this.isJustificarModalOpen.set(true);
    }
  }

  onJustifySuccess(assistanceId: number): void {
    console.log(`Justificante enviado para la falta ${assistanceId}. A la espera del profesor.`);
  }
}