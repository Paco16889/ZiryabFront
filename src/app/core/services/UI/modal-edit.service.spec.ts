import { TestBed } from '@angular/core/testing';

import { ModalEditService } from './modal-edit.service';

describe('ModalEditService', () => {
  let service: ModalEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
