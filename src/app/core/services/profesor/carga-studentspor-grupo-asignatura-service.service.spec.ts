import { TestBed } from '@angular/core/testing';

import { CargaStudentsporGrupoAsignaturaServiceService } from './carga-studentspor-grupo-asignatura-service.service';

describe('CargaStudentsporGrupoAsignaturaServiceService', () => {
  let service: CargaStudentsporGrupoAsignaturaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaStudentsporGrupoAsignaturaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
