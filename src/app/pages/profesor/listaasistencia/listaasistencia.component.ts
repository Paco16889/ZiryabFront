import { Component, inject } from '@angular/core';
import { CargaStudentsporGrupoAsignaturaService } from '../../../core/services/profesor/carga-studentspor-grupo-asignatura.service';
import { TranslateModule } from '@ngx-translate/core';

import { TarjetaasistenciaComponent } from '../tarjetaasistencia/tarjetaasistencia.component';

/** Lista de asistencia del profesor basada en alumnos cargados por asignatura/grupo. */
@Component({
  selector: 'app-listaasistencia',
  imports: [TarjetaasistenciaComponent, TranslateModule],
  templateUrl: './listaasistencia.component.html',
  styleUrl: './listaasistencia.component.scss'
})
export class ListaasistenciaComponent {
    /** Servicio que expone los alumnos filtrados para pintar tarjetas de asistencia. */
    readonly studentsService = inject(CargaStudentsporGrupoAsignaturaService);

}
