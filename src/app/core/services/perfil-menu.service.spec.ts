import { TestBed } from '@angular/core/testing';
import { PerfilMenuService } from './perfil-menu.service';

describe('PerfilMenuService', () => {
  let service: PerfilMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isMenuOpen signal', () => {
    it('should have initial state as false', () => {
      expect(service.isMenuOpen()).toBeFalse();
    });
  });

  describe('toggleMenu', () => {
    it('should toggle the state from false to true to false', () => {
      expect(service.isMenuOpen()).toBeFalse();

      service.toggleMenu();
      expect(service.isMenuOpen()).toBeTrue();

      service.toggleMenu();
      expect(service.isMenuOpen()).toBeFalse();
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
