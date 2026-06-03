import { TestBed } from '@angular/core/testing';

import { ToggleService } from './toggle.service';

describe('ToggleService', () => {
  let service: ToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state null', () => {
    expect(service.openedMenu()).toBeNull();
  });

  it('should open a menu when toggled for the first time', () => {
    service.toggle('students');
    expect(service.openedMenu()).toBe('students');
  });

  it('should close the menu when toggling the currently open menu', () => {
    service.toggle('students'); // Abre
    service.toggle('students'); // Cierra
    expect(service.openedMenu()).toBeNull();
  });

  it('should switch menu when toggling a different menu', () => {
    service.toggle('students');
    service.toggle('teachers');
    expect(service.openedMenu()).toBe('teachers');
  });
});
