import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'validation',
  standalone: true
})
export class ValidationPipe implements PipeTransform {
  transform(value: any, errorObj: ValidationErrors | null, propertyName: string): unknown {

    //Gelen kurallardan ilk kuralı al.
    let firstRule = Object.keys(errorObj!)[0];

    // Kurala ait mesajı getir ve propertName ataması yap.
    let messages = value[firstRule].replace("{propertyName}", propertyName);

    //Kurala ait tüm gereken değişken atamalarını yap.
    Object.keys(errorObj![firstRule]).forEach((x) => {
      messages = messages.replace(`{${x}}`, errorObj![firstRule][x])  
    });

    return messages;
  }

}