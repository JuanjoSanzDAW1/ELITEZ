import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard'; 
import { AjustesComponent } from './ajustes/ajustes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 🔐 Rutas protegidas
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent, canActivate: [AuthGuard] },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'videos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./videoclases/video.component').then(m => m.VideoClasesComponent)
  },
  {
    path: 'cuotas',
    canActivate: [AuthGuard], //No da acceso si no hay token válido
    loadComponent: () => import('./cuotas/cuotas.component').then(m => m.CuotasComponent)
  },
  {
    path: 'ajustes',
    component: AjustesComponent,
    canActivate: [AuthGuard]  
  },

  //redirige al login
  { path: '**', redirectTo: 'login' }
];
