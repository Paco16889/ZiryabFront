import { Routes } from '@angular/router';
import { LoginComponent } from './pages/shared/login/login.component';
import { DashboardComponent } from './pages/alumno/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ClasesComponent } from './pages/alumno/clases/clases.component';
import { GestionComponent } from './pages/alumno/gestion/gestion.component';
import { TemarioComponent } from './pages/alumno/temario/temario.component';
import { FichaUsuarioComponent } from './pages/alumno/ficha-usuario/ficha-usuario.component'; 
import { RegisterComponent } from './pages/admin/register/register.component';
import { UpdateComponent } from './pages/admin/update/update.component';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'dashboard',
        component:DashboardComponent,
        canActivate:[authGuard]
    },
    {
        path:'clases',
        component:ClasesComponent
    },
    {
        path:'gestion',
        component:GestionComponent
    },
    {
        path:'temario/:claseId',
        component:TemarioComponent
    },
    {
        path:'ficha-usuario', 
        component:FichaUsuarioComponent 
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'update',
        component:UpdateComponent
    },
    {
        path:'dashboard-admin',
        component:DashboardAdminComponent,
        canActivate:[authGuard]
    }

];