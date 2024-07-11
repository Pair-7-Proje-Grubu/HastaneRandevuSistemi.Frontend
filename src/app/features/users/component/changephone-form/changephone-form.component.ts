import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-changephone-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonComponent, RouterLink
  ],
  templateUrl: './changephone-form.component.html',
  styleUrls: ['./changephone-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangephoneFormComponent {
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  changePhoneFormGroup: FormGroup;
  currentPhoneNumber: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.changePhoneFormGroup = this.formBuilder.group({
      newPhoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit() {
    const userEmail = this.authService.getEmailToken();
    if (userEmail) {
      this.userService.getUserPhoneNumber(userEmail).subscribe({
        next: (response: any) => {
          const parsedResponse = JSON.parse(response);
          this.currentPhoneNumber = parsedResponse.phone; //JSON verisinden sadece telefon numarasını alma
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching phone number:', err);
          this.error.emit('Mevcut telefon numarası alınamadı.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  change() {
    if (this.changePhoneFormGroup.invalid) {
      this.changePhoneFormGroup.markAllAsTouched();
      this.error.emit('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }

    const userEmail = this.authService.getEmailToken();
    if (userEmail) {
      const newPhoneNumber = this.changePhoneFormGroup.value.newPhoneNumber;

      this.userService.changePhoneNumber(userEmail, newPhoneNumber).subscribe({
        next: (response) => {
          console.log('Phone number change response:', response);
          if (response.isSuccess || (typeof response === 'string' && response.includes('başarıyla'))) {
            const successMessage = response.message || response || 'Telefon numarası başarıyla güncellendi.';
            this.success.emit(successMessage);
            this.changePhoneFormGroup.reset();
            this.currentPhoneNumber = newPhoneNumber;
            this.cdr.detectChanges();
          } else {
            this.error.emit(response.message || 'Telefon numarası değiştirme işlemi başarısız oldu.');
          }
        },
        error: (err) => {
          console.error('Phone number change error:', err);
          this.error.emit('Telefon numarası değiştirme işlemi sırasında bir hata oluştu.');
        }
      });
    } else {
      this.error.emit('Email bilgisi alınamadı.');
    }
  }

  onFormSubmit() {
    this.change();
  }
}