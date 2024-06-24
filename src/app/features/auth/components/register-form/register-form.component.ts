import { RegisterCredentials } from '../../models/register-credentials';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorFieldComponent } from "../../../../shared/components/error-field/error-field.component";
import { ValidationService } from '../../../validation/services/validation.service';
import { matchValidator } from '../../../validation/validator/match.validator';


@Component({
    selector: 'app-register-form',
    standalone: true,
    templateUrl: './register-form.component.html',
    styleUrl: './register-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, RouterLink, ErrorFieldComponent]
})
export class RegisterFormComponent {
  registerFormGroup: FormGroup;
  @Output() success = new EventEmitter<void>();

  constructor(formBuilder: FormBuilder, private authService: AuthService) {
    this.registerFormGroup = formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      birthDate: ['', [Validators.required]],
      gender: ['M', [Validators.required, Validators.maxLength(1)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required, matchValidator('password')]],
      userAgreement: [false, Validators.requiredTrue]
    });

    this.registerFormGroup.controls["password"].setValidators(
      [Validators.required, Validators.minLength(6), Validators.maxLength(50), matchValidator('confirmPassword', true)]
    );

  }

  register() {
    const registerCredentials: RegisterCredentials = {
      firstName: this.registerFormGroup.value.firstName,
      lastName: this.registerFormGroup.value.lastName,
      birthDate: this.registerFormGroup.value.birthDate,
      gender: this.registerFormGroup.value.gender,
      email: this.registerFormGroup.value.email,
      phone: this.registerFormGroup.value.phone,
      password: this.registerFormGroup.value.password,
    };
    this.authService.register(registerCredentials).subscribe({
      complete: () => {
        this.success.emit();
      },
    });
  }

  onFormSubmit() {
    if (this.registerFormGroup.invalid) {
      console.error('Invalid form');
      return;
    }

    this.register();
  }
}
