import { TestBed } from '@angular/core/testing';

import { ModalEditServiceService } from './modal-edit-service.service';

describe('ModalEditServiceService', () => {
  let service: ModalEditServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
