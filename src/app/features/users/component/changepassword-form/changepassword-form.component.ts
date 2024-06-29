import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ChangeCredentials } from '../../models/change-credentials';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-changepassword-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonComponent, RouterLink
  ],
  templateUrl: './changepassword-form.component.html',
  styleUrls: ['./changepassword-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangepasswordFormComponent {
  @Output() success = new EventEmitter<void>();
  changePasswordFormGroup: FormGroup;

  showCurrentPassword: boolean = true;
  showNewPassword: boolean = true;
  showConfirmPassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordFormGroup = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  change() {
    const email = this.authService.getEmailToken();

    if (email) {
      const changeCredentials: ChangeCredentials = {
        email: email,
        currentPassword: this.changePasswordFormGroup.value.currentPassword,
        newPassword: this.changePasswordFormGroup.value.newPassword
      };

      this.userService.changePassword(changeCredentials).subscribe({
        complete: () => {
          this.success.emit();
        },
        error: (error) => {
          this.changePasswordFormGroup.get('currentPassword')!.setErrors({ invalidCurrentPassword: true });
        }
      });
    } else {
      throw new Error('Email bilgisi alınamadı.');
    }
  }

  onFormSubmit() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
      return;
    }

    this.change();
    this.changePasswordFormGroup.reset();
  }

  togglePasswordVisibility(inputId: string) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    switch (inputId) {
      case 'currentPassword':
        this.showCurrentPassword = !this.showCurrentPassword;
        input.type = this.showCurrentPassword ? 'password' : 'text';
        break;
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        input.type = this.showNewPassword ? 'password' : 'text';
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        input.type = this.showConfirmPassword ? 'password' : 'text';
        break;
    }
  }
}