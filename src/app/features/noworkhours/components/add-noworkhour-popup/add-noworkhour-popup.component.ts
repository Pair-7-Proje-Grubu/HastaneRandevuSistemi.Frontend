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

  constructor(
    private noworkhourService: NoworkhoursService,
    public dialogRef: MatDialogRef<AddNoworkhourPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string | number; title: string; start: Date; end: Date; details: string }
    // title: string; details: string
  ) {
    // Timepicker input alanlarına zaman değerlerini ayarlama
    this.startTime = data.start ? this.formatTime(new Date(data.start)) : '';
    this.endTime = data.end ? this.formatTime(new Date(data.end)) : '';
    this.isNewEvent = !data.title;
    console.log('Dialog Data in Constructor:', this.data);
  }

  ngOnInit() {
    this.isNewEvent = !this.data.title; // title boşsa yeni bir eventtir
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTime(): void {
    if (this.startTime && this.endTime && this.data.start && this.data.end) {
      const newTime = {
        date: this.data.start,
        startTime: this.startTime,
        endTime: this.endTime
      };
      this.selectedTimes.push(newTime);
      // Yeni saat ekledikten sonra giriş alanlarını temizle
      this.startTime = '';
      this.endTime = '';
    }
  }

  removeTime(time: { date: Date, startTime: string, endTime: string }): void {
    const index = this.selectedTimes.indexOf(time);
    if (index > -1) {
      this.selectedTimes.splice(index, 1);
    }
  }

  onSaveClick(): void {
    if (this.startTime) {
      const [hours, minutes] = this.startTime.split(':').map(Number);
      this.data.start!.setHours(hours);
      this.data.start!.setMinutes(minutes);
    }
    if (this.endTime) {
      const [hours, minutes] = this.endTime.split(':').map(Number);
      this.data.end!.setHours(hours);
      this.data.end!.setMinutes(minutes);
    }
    // this.noworkhourService.saveEvent(this.data.start!, this.data.end!);
    console.log('Saving Event Data:', this.data);
    this.dialogRef.close(this.data);
  }

  private formatTime(date: Date | null): string {
    if (!date) return ''; // null kontrolü
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onDeleteClick(): void {
    console.log('Deleting Event Data:', this.data);
    this.dialogRef.close({ delete: true, id: this.data.id.toString() }); // ID'yi geri döndürüyoruz
  }
}

