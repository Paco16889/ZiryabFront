import { TestBed } from '@angular/core/testing';

import { ModalDeleteServiceService } from './modal-delete-service.service';

describe('ModalDeleteServiceService', () => {
  let service: ModalDeleteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalDeleteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
