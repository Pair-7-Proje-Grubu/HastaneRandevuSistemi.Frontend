import { Routes } from '@angular/router';
import { authRoutes } from './routes/auth/auth.routes';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { DashboardPageComponent } from './routes/dashboard-page/dashboard-page.component';
import { securedRouteGuard } from './core/auth/guards/secured-route.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { DoctorPageComponent } from './routes/doctors/doctor-page/doctor-page.component';
import { AdminPageComponent } from './routes/admins/admin-page/admin-page.component';
import { BookAppointmentComponent } from './routes/patients/book-appointment/book-appointment.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo:'home', pathMatch:'full',
  },
  {
      path: 'home',
      component: HomePageComponent,
      canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [securedRouteGuard],
    children: [
      { path: 'doctor', component: DoctorPageComponent },
      { path: 'admin', component: AdminPageComponent },
      { path: 'patient' , children: [
        { path: 'book-appointment', component: BookAppointmentComponent }
      ] },
    ],
  },



  ...authRoutes,
];
