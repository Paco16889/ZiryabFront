import { Routes } from '@angular/router';
import { LoginComponent } from './pages/shared/login/login.component';

import { DashboardComponent } from './pages/alumno/dashboard/dashboard.component';
import { ClasesComponent } from './pages/alumno/clases/clases.component';
import { ClasesProfesorComponent } from './pages/profesor/clases-profesor/clases-profesor.component';
import { GestionComponent } from './pages/alumno/gestion/gestion.component';
import { TemarioAlumnoComponent } from './pages/alumno/temario-alumno/temario-alumno.component';
import { TemarioProfesorComponent } from './pages/profesor/temario-profesor/temario-profesor.component';
import { FichaUsuarioComponent } from './pages/alumno/ficha-usuario/ficha-usuario.component';
import { FichaProfesorComponent } from './pages/profesor/ficha-profesor/ficha-profesor.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';
import { AboutComponent } from './pages/shared/about/about.component';
import { MenuClaseComponent } from './pages/profesor/menu-clase/menu-clase.component';
import { TaskListComponent } from './pages/profesor/tareas/task-list/task-list.component';
import { HorarioAlumnoComponent } from './pages/alumno/horario/horario-alumno.component';
import { MisNotasComponent } from './pages/alumno/mis-notas/mis-notas.component';
import { HorarioProfesorComponent } from './pages/profesor/horario/horario-profesor.component';
import { CalendarioComponent } from './pages/shared/calendario/calendario.component';
import { GestionNotasComponent } from './pages/profesor/gestion-notas/gestion-notas.component';

/**
 * Definición de rutas de la aplicación.
 * Organizada en secciones: rutas públicas, rutas protegidas por autenticación,
 * rutas por rol (estudiante, profesor, administrador) y catch-all.
 * ATENCIÓN: dashboard y ficha-usuario están duplicados, pendiente de limpiar.
 */
export const routes: Routes = [
    // ============================================
    // RUTAS PÚBLICAS (sin autenticación)
    // ============================================

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },

    {
        path: 'login',
        component: LoginComponent,
    },

    // ============================================
    // RUTAS PROTEGIDAS PARA TODOS (autenticados)
    // ============================================

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT', 'TEACHER'] },
    },

    {
        path: 'ficha-usuario',
        component: FichaUsuarioComponent,
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT'] },
    },
    {
        path: 'ficha-profesor',
        component: FichaProfesorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },

    {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthGuard]

    },

    {
        path: 'issues',
        loadComponent: () =>
            import('./pages/admin/entities/issue/issue-list/issue-list.component').then(
                (m) => m.IssueListComponent,
            ),
        canActivate: [AuthGuard],
        data: { issueListVariant: 'standalone' },
    },

    // ============================================
    // RUTAS DE PROFESOR (TEACHER)
    // ============================================
    {
        path: 'clases-profesor',
        component: ClasesProfesorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },

    },
    {
        path: 'horario-profesor',
        component: HorarioProfesorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },
    {
        path: 'menu-clase/:idTeacherAssignment',
        component: MenuClaseComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },
    {
        path: 'tareas/:idTeacherAssignment',
        component: TaskListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },
    {
        path: 'evaluaciones',
        component: GestionNotasComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },
    // ===================================================
    // RUTAS DE PROFESOR Y ESTUDIANETE (TEACHER, STUDENT)
    // ===================================================
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT', 'TEACHER'] }
    },



    {
        path: 'temario/:claseId',
        component: TemarioAlumnoComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['STUDENT'] },
    },
    {
        path: 'tarea/:id',
        loadComponent: () => import('./pages/alumno/student-task-detail/student-task-detail.component').then(c => c.StudentTaskDetailComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['STUDENT'] },
    },
    {
        path: 'temario-profesor/:claseId',
        component: TemarioProfesorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },
    {
        path: 'calificar-tarea/:id',
        loadComponent: () => import('./pages/profesor/calificar-tarea/calificar-tarea.component').then(c => c.CalificarTareaComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },
    {
        path: 'tarea/:taskId/entregas',
        loadComponent: () => import('./pages/profesor/entregas-tarea/entregas-tarea.component').then(c => c.EntregasTareaComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER'] },
    },


    {
        path: 'gestion',
        component: GestionComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER', 'STUDENT'] },
    },
    {
        path: 'calendario',
        component: CalendarioComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER', 'STUDENT'] },
    },


    // ============================================
    // RUTAS DE ESTUDIANTE (STUDENT)
    // ============================================

    {
        path: 'clases',
        component: ClasesComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['STUDENT'] },
    },
    {
        path: 'horario-alumno',
        component: HorarioAlumnoComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['STUDENT'] },
    },
    {
        path: 'mis-notas',
        redirectTo: 'mis-evaluaciones',
        pathMatch: 'full'
    },
    {
        path: 'mis-evaluaciones',
        component: MisNotasComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['STUDENT'] },
    },

    // ============================================
    // RUTAS DE ADMINISTRADOR (ADMIN)
    // ============================================


    {
        path: 'dashboard-admin',
        component: DashboardAdminComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
    },
    // ============================================
    // CATCH-ALL (rutas no encontradas)
    // ============================================

    {
        path: '**',
        redirectTo: 'login',
    },
];
