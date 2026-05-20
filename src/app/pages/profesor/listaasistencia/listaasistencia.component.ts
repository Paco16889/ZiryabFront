import { Component, inject } from '@angular/core';
import { CargaStudentsporGrupoAsignaturaService } from '../../../core/services/profesor/carga-studentspor-grupo-asignatura.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-listaasistencia',
  imports: [TarjetaasistenciaComponent, TranslateModule],
  templateUrl: './listaasistencia.component.html',
  styleUrl: './listaasistencia.component.scss'
})
export class ListaasistenciaComponent {
    readonly studentsService = inject(CargaStudentsporGrupoAsignaturaService);

}
