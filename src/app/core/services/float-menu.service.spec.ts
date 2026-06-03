import { TestBed } from '@angular/core/testing';
import { FloatMenuService } from './float-menu.service';

describe('FloatMenuService', () => {
  let service: FloatMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloatMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isMenuOpen signal', () => {
    it('should have initial state as false', () => {
      expect(service.isMenuOpen()).toBeFalse();
    });
  });

  describe('openMenu', () => {
    it('should open the menu by setting isMenuOpen to true', () => {
      expect(service.isMenuOpen()).toBeFalse();

      service.openMenu();
      expect(service.isMenuOpen()).toBeTrue();
    });
  });

  describe('closeMenu', () => {
    it('should close the menu if it is currently open', () => {
      service.isMenuOpen.set(true);
      expect(service.isMenuOpen()).toBeTrue();

      service.closeMenu();
      expect(service.isMenuOpen()).toBeFalse();
    });

    it('should do nothing if the menu is already closed', () => {
      expect(service.isMenuOpen()).toBeFalse();

      service.closeMenu();
      expect(service.isMenuOpen()).toBeFalse();
    });
  });
});
