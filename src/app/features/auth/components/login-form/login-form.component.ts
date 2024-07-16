import { LoginCredentials } from './../../models/login-credentials';
import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorFieldComponent } from "../../../../shared/components/error-field/error-field.component";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink,
    ErrorFieldComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  loginFormGroup: FormGroup;
  @Output() success = new EventEmitter<void>();

  propertyNames = {
    email: 'E-posta',
    password: 'Parola'
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onFormSubmit(): void {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.login();
  }

  private login(): void {
    const loginCredentials: LoginCredentials = {
      email: this.loginFormGroup.get('email')?.value,
      password: this.loginFormGroup.get('password')?.value,
    };

    this.authService.login(loginCredentials).subscribe({
      complete: () => {
        this.success.emit();
      },
    });
  }
}