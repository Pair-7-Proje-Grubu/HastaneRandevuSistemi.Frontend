import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { TableComponent } from '../../../shared/components/table/table.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';
import { ListAvailableAppointmentRequest } from '../../../features/appointments/models/list-available-appointment-request';
import { AppointmentDate, DateRange, ListAvailableAppointmentResponse, Slot } from '../../../features/appointments/models/list-available-appointment-response';



@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule, MatTabsModule,MatTableModule,MatExpansionModule,CardComponent,ButtonComponent
  ],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class BookAppointmentComponent {
  readonly panelOpenState = signal(false);
  
  availableAppointments: ListAvailableAppointmentResponse = {
    appointmentDuration:0,
    appointmentDates:[]};
  
  constructor(private appointmentService: AppointmentService){

    const requestBody: ListAvailableAppointmentRequest = {
      doctorId:8,
    };
    
    this.appointmentService.getListAvailableAppointment(requestBody).subscribe(response=>{
        this.availableAppointments = this.generateSlots(response);
      console.log(this.availableAppointments);

    });
  }
  bookAppointment(event: any)
  {
    console.log(event);
    const target = event.target as HTMLElement;
    const time = target.getAttribute('data-time');
    console.log(time);
  }
  
  parseTimeString(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  generateSlots(response : ListAvailableAppointmentResponse): ListAvailableAppointmentResponse {
    
    response.appointmentDates = response.appointmentDates.map(appointmentDate => {
      const slots: Slot[] = [];
  
      appointmentDate.ranges.forEach(range => {
        
        
        let startTime = this.parseTimeString(range.startTime);
        let endTime = this.parseTimeString(range.endTime);

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


