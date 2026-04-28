import { TestBed } from '@angular/core/testing';

import { ModalDeleteService } from './modal-delete.service';

describe('ModalDeleteService', () => {
  let service: ModalDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
