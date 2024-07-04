import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChangepasswordFormComponent } from '../../features/users/component/changepassword-form/changepassword-form.component';
import { ChangephoneFormComponent } from '../../features/users/component/changephone-form/changephone-form.component';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    CommonModule,
    ChangepasswordFormComponent,
    ChangephoneFormComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent { 
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}
  
  onChangeSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  onChangeError(message: string) {
    this.errorMessage = message;
    this.successMessage = null;
    this.cdr.detectChanges();
  }
}