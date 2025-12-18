import { Routes } from '@angular/router';
import { LoginComponent } from './pages/shared/login/login.component';
import { RegisterComponent } from './pages/admin/register/register.component';
import { UpdateComponent } from './pages/admin/update/update.component';
import { DashboardComponent } from './pages/alumno/dashboard/dashboard.component';
import { ClasesComponent } from './pages/alumno/clases/clases.component';
import { ClasesProfesorComponent } from './pages/profesor/clases-profesor/clases-profesor.component';
import { GestionComponent } from './pages/alumno/gestion/gestion.component';
import { TemarioComponent } from './pages/alumno/temario/temario.component';
import { FichaUsuarioComponent } from './pages/alumno/ficha-usuario/ficha-usuario.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AboutComponent } from './pages/shared/about/about.component';

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
        canActivate: [AuthGuard, RoleGuard],
    },

    {
        path: 'about',
        component: AboutComponent
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
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT', 'TEACHER'] }
    },

    {
        path: 'temario/:claseId',
        component: TemarioComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['STUDENT', 'TEACHER'] },
    },

    {
        path: 'gestion',
        component: GestionComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TEACHER','STUDENT'] },
    },

    {
        path: 'ficha-usuario',
        component: FichaUsuarioComponent,
        canActivate: [AuthGuard],
        data: { roles: ['TEACHER','STUDENT'] },
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

    // ============================================
    // RUTAS DE ADMINISTRADOR (ADMIN)
    // ============================================
    {
        path: 'dashboard-admin',
        component: RegisterComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
    },

    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
    },

    {
        path: 'update',
        component: UpdateComponent,
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
