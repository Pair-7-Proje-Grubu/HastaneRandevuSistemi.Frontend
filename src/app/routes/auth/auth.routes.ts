import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { inject } from '@angular/core';

export const authRoutes: Routes = [
  {
    path: 'auth/login', // localhost:4200/auth/login
    canActivate: [()=>!(inject(AuthService).isAuthenticated)],
    component: LoginPageComponent,
  },
];
