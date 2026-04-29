import { Component, inject } from '@angular/core';
import { CargaStudentsporGrupoAsignaturaService } from '../../../core/services/profesor/carga-studentspor-grupo-asignatura.service';

@Component({
  selector: 'app-listaasistencia',
  imports: [TarjetaasistenciaComponent],
  templateUrl: './listaasistencia.component.html',
  styleUrl: './listaasistencia.component.scss'
})
export class ListaasistenciaComponent {
    readonly studentsService = inject(CargaStudentsporGrupoAsignaturaService);

}
