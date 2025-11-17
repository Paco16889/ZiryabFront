import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ClasesComponent } from './pages/clases/clases.component';

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
        component:DashboardComponent
        //canActivate:[authGuard]
    },
    {
        path:'clases',
        component:ClasesComponent
    },
    {
        path:'gestion',
        component:ClasesComponent
    }
];
