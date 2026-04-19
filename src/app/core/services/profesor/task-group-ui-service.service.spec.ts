import { TestBed } from '@angular/core/testing';

import { TaskGroupUiServiceService } from './task-group-ui-service.service';

describe('TaskGroupUiServiceService', () => {
  let service: TaskGroupUiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskGroupUiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
