import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NoworkhoursService } from '../../services/noworkhours.service';

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
        NgxMatTimepickerModule,
    ],
    templateUrl: './add-noworkhour-popup.component.html',
    styleUrl: './add-noworkhour-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNoworkhourPopupComponent { 
  startTime: string = '';
  endTime: string = '';
  isNewEvent: boolean = false;
  selectedTimes: { date: Date, startTime: string, endTime: string }[] = [];
  currentTitle: string = '';
  isAppointment: boolean = false;
  isCancelledAppointment: boolean = false;

  constructor(
    private noworkhourService: NoworkhoursService,
    public dialogRef: MatDialogRef<AddNoworkhourPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      id: string | number; 
      title: string; 
      start: Date; 
      end: Date; 
      details: string;
      isAppointment: boolean;
      appointmentId?: number;
      isCancelledAppointment: boolean;
    }
  ) {
    // Timepicker input alanlarına zaman değerlerini ayarlama
    this.startTime = data.start ? this.formatTime(new Date(data.start)) : '';
    this.endTime = data.end ? this.formatTime(new Date(data.end)) : '';
    this.isNewEvent = !data.title;
    this.isAppointment = data.isAppointment;
    this.isCancelledAppointment = data.isCancelledAppointment;
    console.log('Dialog Data in Constructor:', this.data);
  }

  ngOnInit() {
    console.log('Dialog data:', this.data); // Debug için
    this.isNewEvent = !this.data.title;
    this.isAppointment = this.data.isAppointment;
    this.isCancelledAppointment = this.data.isCancelledAppointment;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTime(): void {
    if (this.startTime && this.endTime && this.data.start && this.data.end) {
      const newTime = {
        date: new Date(this.data.start),
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.currentTitle // Her zaman aralığı için ayrı bir başlık
      };
      this.selectedTimes.push(newTime);
      // Yeni saat ekledikten sonra giriş alanlarını temizle
      this.startTime = '';
      this.endTime = '';
      this.currentTitle = ''; // Başlığı da temizle
    }
  }

  removeTime(time: { date: Date, startTime: string, endTime: string }): void {
    const index = this.selectedTimes.indexOf(time);
    if (index > -1) {
      this.selectedTimes.splice(index, 1);
    }
  }

  onSaveClick(): void {
    if (this.selectedTimes.length > 0) {
      // Birden fazla saat seçilmişse
      const events = this.selectedTimes.map(time => {
        const startDate = new Date(this.data.start);
        const endDate = new Date(this.data.start);
        const [startHours, startMinutes] = time.startTime.split(':').map(Number);
        const [endHours, endMinutes] = time.endTime.split(':').map(Number);
        
        startDate.setHours(startHours, startMinutes, 0, 0);
        endDate.setHours(endHours, endMinutes, 0, 0);
  
        return {
          title: this.data.title,
          start: startDate.toISOString(),
          end: endDate.toISOString()
        };
      });
      this.dialogRef.close(events);
    } else {
      // Tek bir saat seçilmişse
      const startDate = new Date(this.data.start);
      const endDate = new Date(this.data.end);
      
      if (this.startTime) {
        const [hours, minutes] = this.startTime.split(':').map(Number);
        startDate.setHours(hours, minutes, 0, 0);
      }
      if (this.endTime) {
        const [hours, minutes] = this.endTime.split(':').map(Number);
        endDate.setHours(hours, minutes, 0, 0);
      }
      
      this.dialogRef.close({
        id: this.data.id,
        title: this.data.title,
        start: startDate,
        end: endDate
      });
    }
  }

  private formatTime(date: Date | null): string {
    if (!date) return ''; // null kontrolü
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onDeleteClick(): void {
    if (this.isAppointment) {
      this.dialogRef.close({ delete: true, appointmentId: this.data.appointmentId });
    } else {
      this.dialogRef.close({ delete: true, id: this.data.id.toString() });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({ cancel: true, appointmentId: this.data.appointmentId });
  }
}

