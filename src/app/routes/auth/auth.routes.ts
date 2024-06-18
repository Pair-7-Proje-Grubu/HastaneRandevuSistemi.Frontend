import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { securedRouteGuard } from '../../core/auth/guards/secured-route.guard';
import { AuthRoles } from '../../core/auth/constants/auth-roles';
import { MyAccountPageComponent } from './my-account-page/my-account-page.component';

export const authRoutes: Routes = [
  {
    path: 'auth/login', // localhost:4200/auth/login
    component: LoginPageComponent,
  },
  {
    path: 'my-account',
    canActivate: [securedRouteGuard],
    component: MyAccountPageComponent,
  }
];
