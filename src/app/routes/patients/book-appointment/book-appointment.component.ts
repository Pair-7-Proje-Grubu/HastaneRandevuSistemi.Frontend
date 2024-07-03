import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import { TableComponent } from '../../../shared/components/table/table.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';
import { ListAvailableAppointmentRequest } from '../../../features/appointments/models/list-available-appointment-request';
import { AppointmentDate, DateRange, ListAvailableAppointmentResponse, Slot } from '../../../features/appointments/models/list-available-appointment-response';
import { MatDialog } from '@angular/material/dialog';
import { DynamicDialogComponent } from '../../../shared/components/dynamic-dialog/dynamic-dialog.component';
import { IDynamicDialogConfig } from '../../../shared/models/dynamic-dialog/dynamic-dialog-config';
import { MatIcon } from '@angular/material/icon';
import { BookAppointmentRequest } from '../../../features/appointments/models/book-appointment-request';



@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule, MatTabsModule,MatTableModule,MatExpansionModule,CardComponent,ButtonComponent,MatIcon
  ],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class BookAppointmentComponent {
  readonly dialog = inject(MatDialog);

  availableAppointments: ListAvailableAppointmentResponse = {
    appointmentDuration:0,
    appointmentDates:[]};
    

  selecteds : any = {
    clinicName:"",
    doctorName:"",
    dateTime:"",
  };


    @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate: TemplateRef<any> | undefined;
    @ViewChild('successDialogTemplate') successDialogTemplate: TemplateRef<any> | undefined;
    @ViewChild('failedDialogTemplate') failedDialogTemplate: TemplateRef<any> | undefined;
    @ViewChild('dateMatTabGroup') tabGroup: MatTabGroup | undefined;
  
  constructor(private appointmentService: AppointmentService){

    const listAvailableAppointmentRequest: ListAvailableAppointmentRequest = {
      doctorId:2,
    };




    this.appointmentService.getListAvailableAppointment(listAvailableAppointmentRequest).subscribe(response=>{
      this.availableAppointments = this.generateSlots(response);
      console.log(this.availableAppointments);
    });
  }

  bookAppointment(event: any)
  {
    

    const target = event.target.parentElement as HTMLElement;
    const dateStr = this.availableAppointments.appointmentDates[this.tabGroup?.selectedIndex!].date;
    const timeStr = target.getAttribute('date-time') ?? "";
    const dateTime = this.parseDateTimeUTCString(timeStr,dateStr);
    const dateTimeForFrontend = this.parseDateTimeString(timeStr,dateStr);
    
    const dialogRef = this.dialog.open(DynamicDialogComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Randevu Kaydı',
        dialogContent: this.confirmationDialogTemplate,
        acceptButtonTitle: 'Onayla',
        declineButtonTitle: 'Vazgeç',
        dialogType: 'information'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      console.log("onaylandı!");
      
      const bookAppointmentRequest: BookAppointmentRequest = {
        doctorId:2,
        dateTime: dateTime.toISOString(),
      };
      

      this.selecteds.dateTime = dateTimeForFrontend;
      console.log(this.selecteds);
      

      this.appointmentService.bookAvailableAppointment(bookAppointmentRequest).subscribe({
        next: () => {
          this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: <IDynamicDialogConfig>{
              title: 'Sonuç',
              dialogContent: this.successDialogTemplate,
              acceptButtonTitle: 'Tamam',
              dialogType: 'success' 
            },
          }); 
        },

        error: () => {
          this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: <IDynamicDialogConfig>{
              title: 'Sonuç',
              dialogContent: this.failedDialogTemplate,
              acceptButtonTitle: 'Tamam',
              dialogType: 'failed' 
            },
          }); 
        }
      });
    });

  }

  parseDateTimeUTCString(timeString: string,dateTime: string = ""): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date =  dateTime != "" ? new Date(dateTime) : new Date();
    date.setHours(hours, minutes, 0, 0);

    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      hours,
      minutes,
      0
  ));
  return utcDate;
}

  parseDateTimeString(timeString: string,dateTime: string = ""): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date =  dateTime != "" ? new Date(dateTime) : new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }


  
  generateSlots(response : ListAvailableAppointmentResponse): ListAvailableAppointmentResponse {
    
    response.appointmentDates = response.appointmentDates.map(appointmentDate => {
      const slots: Slot[] = [];
  
      appointmentDate.ranges.forEach(range => {
        
        let startTime = this.parseDateTimeString(range.startTime);
        let endTime = this.parseDateTimeString(range.endTime);

        while (startTime < endTime) {
          const hour = startTime.getHours().toString().padStart(2, '0');
          const minute = startTime.getMinutes().toString().padStart(2, '0');
          const time = `${hour}:${minute}`;
          
          let slot = slots.find(s => s.hour === `${hour}:00`);
          if (!slot) {
            slot = { hour: `${hour}:00`, times: [] };
            slots.push(slot);
          }
          slot.times.push(time);
  
          startTime.setMinutes(startTime.getMinutes() + response.appointmentDuration);
        }
      });

      return { ...appointmentDate, slots };
    });

    return response;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  }


}


