import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseLayoutComponent } from '../../shared/components/base-layout/base-layout.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    BaseLayoutComponent,
    RouterModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    if (roles.includes('Doctor')) {
      this.router.navigate(['/dashboard/doctor']);
    } else if (roles.includes('Admin')) {
      this.router.navigate(['/dashboard/admin']);
    } else if (roles.includes('Patient')) {
      this.router.navigate(['/dashboard/patient']);
    }
  } }
