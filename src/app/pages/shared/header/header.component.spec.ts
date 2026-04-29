import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header.component';
import { PerfilMenuService } from '../../../core/services/perfil-menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';

/** Loader mínimo para tests; Compodoc excluye normalmente `*.spec.ts` del árbol de documentación. */
class StubTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<Record<string, unknown>> {
    return of({});
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: StubTranslateLoader },
        }),
      ],
      providers: [
        {
          provide: PerfilMenuService,
          useValue: { toggleMenu: (): void => {} },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser$: of(null),
            getCurrentUser: (): null => null,
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            unreadCount$: of(0),
            notification$: of(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
