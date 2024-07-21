import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

interface FieldConfig {
  name: string;
  label?: string;
  value: any;
  type?: string;
  options?: {value: any, label: string}[];
  placeholder?: string;
  readonly?: boolean;
  hidden?: boolean;
  validators?: any[];
}

interface DialogData {
  title: string;
  fields: FieldConfig[];
}

@Component({
    selector: 'app-generic-popup',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule
    ],
    templateUrl: './generic-popup.component.html',
    styleUrl: './generic-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericPopupComponent implements OnInit {
    editForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<GenericPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
      ) {
        this.editForm = this.fb.group(this.createFormGroup(data.fields));
      }

      ngOnInit() {
        const formGroup: {[key: string]: FormControl} = {};
        this.data.fields.forEach((field: FieldConfig) => {
          if (field.hidden) {
            formGroup[field.name] = new FormControl(field.value);
          } else if (field.readonly) {
            formGroup[field.name] = new FormControl({value: field.value, disabled: true});
          } else {
            formGroup[field.name] = new FormControl(field.value, field.validators || []);
          }
        });
        this.editForm = new FormGroup(formGroup);
      }
    
      private createFormGroup(fields: any): any {
        const group: any = {};
        for (const field of fields) {
          group[field.name] = [field.value || ''];
        }
        return group;
      }
    
      onSave() {
        if (this.editForm.valid) {
          const formValue = this.editForm.value;
          const result = {
            id: this.data.id, // ID'yi ekleyin
            ...formValue
          };
          this.dialogRef.close(result);
        }
      }
    
      onCancel(): void {
        this.dialogRef.close();
      }

      compareOptionValues(option1: any, option2: any): boolean {
        return option1 != null && option2 != null && option1 === option2;
      }
 }
