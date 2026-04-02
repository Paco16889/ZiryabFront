import { Component, inject } from '@angular/core';
import { CargaStudentsporGrupoAsignaturaServiceService } from '../../../core/services/profesor/carga-studentspor-grupo-asignatura-service.service';
import { TarjetaasistenciaComponent } from "../tarjetaasistencia/tarjetaasistencia.component";

@Component({
  selector: 'app-listaasistencia',
  imports: [TarjetaasistenciaComponent],
  templateUrl: './listaasistencia.component.html',
  styleUrl: './listaasistencia.component.scss'
})
export class ListaasistenciaComponent {
    readonly studentsService = inject(CargaStudentsporGrupoAsignaturaServiceService);

}
