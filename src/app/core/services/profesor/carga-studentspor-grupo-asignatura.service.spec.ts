import { TestBed } from '@angular/core/testing';

import { CargaStudentsporGrupoAsignaturaService } from './carga-studentspor-grupo-asignatura.service';

describe('CargaStudentsporGrupoAsignaturaService', () => {
  let service: CargaStudentsporGrupoAsignaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaStudentsporGrupoAsignaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
