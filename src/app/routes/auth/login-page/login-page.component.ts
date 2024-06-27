import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginFormComponent } from '../../../features/auth/components/login-form/login-form.component';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginFormComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  constructor(private router: Router, private authService: AuthService) { }
  now = new Date();

  onLoginSucces() {
    const roles = this.authService.getUserRoles();
    if (roles.includes('Admin')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (roles.includes('Doctor')) {
      this.router.navigate(['/doctor/dashboard']);
    } else if (roles.includes('Patient')) {
      this.router.navigate(['/patient/dashboard']);
    }
  } 
}
