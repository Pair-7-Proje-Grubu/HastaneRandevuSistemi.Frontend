import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy,Component,EventEmitter,Output,TemplateRef,ViewChild,inject} from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DynamicDialogComponent } from '../../../../shared/components/dynamic-dialog/dynamic-dialog.component';
import { ErrorFieldComponent } from "../../../../shared/components/error-field/error-field.component";
import { IDynamicDialogConfig } from '../../../../shared/models/dynamic-dialog/dynamic-dialog-config';
import { matchValidator } from '../../../validation/validator/match.validator';
import { AuthService } from '../../services/auth.service';
import { RegisterCredentials } from '../../models/register-credentials';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ErrorFieldComponent,
    MatDialogModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  registerFormGroup: FormGroup;
  @Output() success = new EventEmitter<void>();

  @ViewChild('successDialogTemplate') successDialogTemplate: TemplateRef<any> | undefined;
  @ViewChild('failedDialogTemplate') failedDialogTemplate: TemplateRef<any> | undefined;
  @ViewChild('aydinlatmaMetniDialog') aydinlatmaMetniDialog!: TemplateRef<any>;

  readonly dialog = inject(MatDialog);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.registerFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthDate: ['', [Validators.required]],
      gender: ['M', [Validators.required, Validators.maxLength(1)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30), matchValidator('confirmPassword', true)]],
      confirmPassword: ['', [Validators.required, matchValidator('password')]],
      userAgreement: [false, Validators.requiredTrue]
    });
  }

  onFormSubmit(): void {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }

    this.register();
  }

  private register(): void {
    const registerCredentials: RegisterCredentials = {
      firstName: this.registerFormGroup.get('firstName')?.value,
      lastName: this.registerFormGroup.get('lastName')?.value,
      birthDate: this.registerFormGroup.get('birthDate')?.value,
      gender: this.registerFormGroup.get('gender')?.value,
      email: this.registerFormGroup.get('email')?.value,
      phone: this.registerFormGroup.get('phone')?.value,
      password: this.registerFormGroup.get('password')?.value,
    };

    this.authService.register(registerCredentials).subscribe({
      next: () => {
        this.registerDialog("success");
        this.success.emit();
      },
      error: () => {
        this.registerDialog("failed");
      }
    });
  }

  private registerDialog(dialogType: "success" | "failed"): void {
    this.dialog.open(DynamicDialogComponent, {
      width: '400px',
      data: <IDynamicDialogConfig>{
        title: 'Kayit',
        dialogContent: dialogType === "success" ? this.successDialogTemplate : this.failedDialogTemplate,
        dialogType: dialogType,
        acceptButtonTitle: 'Tamam'
      }
    });
  }

  openAydinlatmaMetni(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(this.aydinlatmaMetniDialog);
  }
}