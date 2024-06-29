import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangepasswordFormComponent } from '../../features/users/component/changepassword-form/changepassword-form.component';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    CommonModule,
    ChangepasswordFormComponent
  ],
  templateUrl: './changePassword-page.component.html',
  styleUrl: './changePassword-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPageComponent { 
  constructor(private router: Router) {}
  
  onChangeSuccess() {
    this.router.navigate(['./']);
  }
}
