# Templates base — angular-feature-generator

Placeholders a sustituir: `{nombre}` (kebab-case), `{Nombre}` (PascalCase),
`{selector}` (`app-{nombre}`), `{rol}`, `{ROL}` (TEACHER/STUDENT/ADMIN), `{CURSO-XX}`.

## `{nombre}.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente {Nombre}.
 * Pantalla del rol {rol}.
 *
 * Ticket Jira: {CURSO-XX}
 */
@Component({
  selector: '{selector}',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './{nombre}.component.html',
  styleUrl: './{nombre}.component.scss',
})
export class {Nombre}Component {
  // private api = inject(...);
}
```

## `{nombre}.component.html`

```html
<section class="p-6">
  <h1 class="text-2xl font-bold mb-4">{{ '{nombre}.title' | translate }}</h1>
  <p>{{ '{nombre}.description' | translate }}</p>
</section>
```

## `{nombre}.component.scss`

```scss
:host {
  display: block;
}
```

## `{nombre}.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { {Nombre}Component } from './{nombre}.component';

describe('{Nombre}Component', () => {
  let component: {Nombre}Component;
  let fixture: ComponentFixture<{Nombre}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [{Nombre}Component],
    }).compileComponents();

    fixture = TestBed.createComponent({Nombre}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## `{nombre}.service.ts` (opcional, si hay backend)

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { {Nombre} } from '../../models/{nombre}.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Servicio de {Nombre}.
 * Ticket Jira: {CURSO-XX}
 */
@Injectable({ providedIn: 'root' })
export class {Nombre}Service {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(): Observable<{Nombre}[]> {
    return this.http
      .get<ApiResponse<{Nombre}[]>>(`${this.apiUrl}/{nombre}`)
      .pipe(map((res) => res.data));
  }
}
```

## `{nombre}.model.ts` (opcional)

```typescript
/**
 * Modelo {Nombre} del dominio.
 */
export interface {Nombre} {
  id: number;
  // ...campos
}
```

## Entrada a añadir en `app.routes.ts`

```typescript
{
  path: '{ruta}',
  component: {Nombre}Component,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['{ROL}'] },
},
```

O versión lazy:

```typescript
{
  path: '{ruta}',
  loadComponent: () =>
    import('./pages/{rol}/{nombre}/{nombre}.component').then(c => c.{Nombre}Component),
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['{ROL}'] },
},
```

## Claves i18n a añadir en `src/assets/i18n/es.json`

```json
{
  "{nombre}": {
    "title": "{Nombre}",
    "description": "Pantalla de {nombre}"
  }
}
```
