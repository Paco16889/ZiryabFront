import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ClasesComponent } from './pages/alumno/clases/clases.component';
import { GestionComponent } from './pages/gestion/gestion.component';
import { TemarioComponent } from './pages/temario/temario.component';
import { FichaUsuarioComponent } from './pages/ficha-usuario/ficha-usuario.component'; 

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
    }
];