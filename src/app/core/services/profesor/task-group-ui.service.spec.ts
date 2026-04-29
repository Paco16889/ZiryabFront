import { TestBed } from '@angular/core/testing';

import { TaskGroupUiService } from './task-group-ui.service';

describe('TaskGroupUiService', () => {
  let service: TaskGroupUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskGroupUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
