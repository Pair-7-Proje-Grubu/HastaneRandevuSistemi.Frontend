import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';


@Component({
    selector: 'app-add-noworkhour-popup',
    standalone: true,
    imports: [
        CommonModule, 
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatButtonModule,
        MatNativeDateModule,
        FormsModule,
        NgxMatTimepickerModule
    ],
    templateUrl: './add-noworkhour-popup.component.html',
    styleUrl: './add-noworkhour-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNoworkhourPopupComponent { 
  startTime: string = '';
  endTime: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddNoworkhourPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; start: Date; end: Date; details: string } // 'details' property’sini ekledik
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.startTime) {
      const [hours, minutes] = this.startTime.split(':').map(Number);
      this.data.start.setHours(hours);
      this.data.start.setMinutes(minutes);
    }
    if (this.endTime) {
      const [hours, minutes] = this.endTime.split(':').map(Number);
      this.data.end.setHours(hours);
      this.data.end.setMinutes(minutes);
    }
    this.dialogRef.close(this.data);
  }
}

