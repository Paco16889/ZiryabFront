import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-menu-clase',
  standalone: true,
  imports: [TranslateModule, BotonAtrasComponent],
  templateUrl: './menu-clase.component.html',
})
export class MenuClaseComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly idTeacherAssignment = signal<number>(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idTeacherAssignment');
    if (id) {
      this.idTeacherAssignment.set(+id);
    }
  }

  navigateToTareas(): void {
    this.router.navigate(['/tareas', this.idTeacherAssignment()]);
  }

  navigateToAsistencias(): void {
    this.router.navigate(['/ficha-profesor']);
  }
}