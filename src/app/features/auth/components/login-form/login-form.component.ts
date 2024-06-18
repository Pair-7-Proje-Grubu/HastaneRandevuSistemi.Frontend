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

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  loginFormGroup: FormGroup;
  @Output() success = new EventEmitter<void>();

  constructor(formBuilder: FormBuilder, private authService: AuthService) {
    this.loginFormGroup = formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    const loginCredentials: LoginCredentials = {
      email: this.loginFormGroup.value.email,
      password: this.loginFormGroup.value.password,
    };
    this.authService.login(loginCredentials).subscribe({
      complete: () => {
        this.success.emit();
      },
    });
  }

  onFormSubmit() {
    if (this.loginFormGroup.invalid) {
      console.error('Invalid form');
      return;
    }

    this.login();
  }
}
