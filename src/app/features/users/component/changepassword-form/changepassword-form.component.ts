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
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
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
    }, { validators: [this.passwordMatchValidator, this.newPasswordDifferentValidator] });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  newPasswordDifferentValidator(group: FormGroup): { [key: string]: boolean } | null {
    const currentPassword = group.get('currentPassword')?.value;
    const newPassword = group.get('newPassword')?.value;
    return currentPassword !== newPassword ? null : { sameAsOldPassword: true };
  }

  change() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
      if (this.changePasswordFormGroup.hasError('sameAsOldPassword')) {
        this.error.emit('Yeni parola mevcut parola ile aynı olamaz.');
      } else if (this.changePasswordFormGroup.hasError('passwordMismatch')) {
        this.error.emit('Yeni şifre ve onay şifresi eşleşmiyor.');
      } else {
        this.error.emit('Lütfen tüm alanları doğru şekilde doldurunuz.');
      }
      return;
    }

    const email = this.authService.getEmailToken();

    if (email) {
      const changeCredentials: ChangeCredentials = {
        email: email,
        currentPassword: this.changePasswordFormGroup.value.currentPassword,
        newPassword: this.changePasswordFormGroup.value.newPassword
      };

      this.userService.changePassword(changeCredentials).subscribe({
        next: (response) => {
          console.log('Password change response:', response);
          if (response.isSuccess || (typeof response === 'string' && response.includes('başarıyla'))) {
            const successMessage = response.message || response || 'Parola başarıyla güncellendi.';
            this.success.emit(successMessage);
            this.changePasswordFormGroup.reset();
          } else {
            this.error.emit(response.message || 'Parola değiştirme işlemi başarısız oldu.');
          }
        },
        error: (err) => {
          console.error('Password change error:', err);
          if (err.status === 400 && err.error && err.error.message) {
            this.error.emit(err.error.message);
          } else {
            this.error.emit('Mevcut parola hatalı. Lütfen kontrol edip tekrar deneyiniz.');
          }
        }
      });
    } else {
      this.error.emit('Email bilgisi alınamadı.');
    }
  }

  onFormSubmit() {
    this.change();
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