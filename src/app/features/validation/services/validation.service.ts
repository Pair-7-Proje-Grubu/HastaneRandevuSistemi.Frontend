import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {
  errorMessages = {
      required: "{propertyName} alanı boş bırakılamaz.",
      minlength: "{propertyName} alanı {requiredLength} karakterden fazla olmalıdır.",
      maxlength: "{propertyName} alanı {requiredLength} karakterden az olmalıdır.",
  };

  getErrorMessages() {
    return this.errorMessages;
  }
}