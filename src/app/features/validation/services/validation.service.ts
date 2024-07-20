import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {
  errorMessages = {
    required: "{propertyName} alanı boş bırakılamaz.",
    minlength: "{propertyName} en az {requiredLength} karakter uzunluğunda olmalıdır.",
      maxlength: "{propertyName} alanı {requiredLength} karakterden az olmalıdır.",
      email: "Lütfen geçerli e-posta adresini giriniz.",
      pattern: "Lütfen geçerli {propertyName} giriniz.",
      matching: "{propertyName}lar eşleşmiyor.",
  };

  getErrorMessages() {
    return this.errorMessages;
  }
}