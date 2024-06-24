import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective } from '@angular/forms';
import { ValidationPipe } from "../../../features/validation/pipes/validation.pipe";
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../../features/validation/services/validation.service';

@Component({
    selector: 'app-error-field',
    standalone: true,
    templateUrl: './error-field.component.html',
    styleUrl: './error-field.component.scss',
    host: { },
    imports: [CommonModule, ValidationPipe]
})
export class ErrorFieldComponent {

  @Input() control!: FormControl | AbstractControl
  @Input() propertyName!: string;

  constructor(public formDirective:FormGroupDirective, private validationService: ValidationService){}

  errorMessages = this.validationService.getErrorMessages();
}
