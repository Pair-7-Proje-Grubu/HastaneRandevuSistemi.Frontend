import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {
  errorMessages = {
    required: "{propertyName} alanı boş veya hatalı olamaz.",
    minlength: "{propertyName} alanı {requiredLength} karakterden fazla olmalıdır.",
      maxlength: "{propertyName} alanı {requiredLength} karakterden az olmalıdır.",
      email: "Lütfen geçerli e-posta adresini giriniz.",
      pattern: "Lütfen geçerli {propertyName} giriniz.",
      matching: "{propertyName}lar eşleşmiyor.",
  };

  getErrorMessages() {
    return this.errorMessages;
  }
}