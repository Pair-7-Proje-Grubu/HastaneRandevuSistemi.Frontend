import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from '../../../event-utils';
import { WorkingtimesService } from '../../../features/workingtimes/services/workingtimes.service';
import { AddNoworkhourPopupComponent } from '../../../features/noworkhours/components/add-noworkhour-popup/add-noworkhour-popup.component';
import { NoworkhoursService } from '../../../features/noworkhours/services/noworkhours.service';
import { CreateNoWorkHourRequest, NoWorkHour } from '../../../features/noworkhours/models/create-no-work-hour-request';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClinicsService } from '../../../features/clinics/services/clinics.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-calender',
    standalone: true,
    imports: [
        CommonModule, FullCalendarModule, RouterOutlet, AddNoworkhourPopupComponent, 
        MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, FormsModule
    ],
    templateUrl: './calender.component.html',
    styleUrl: './calender.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalenderComponent {
    calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    firstDay: 1,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    slotMinTime: '00:00:00', // Varsayılan
    slotMaxTime: '24:00:00', // Varsayılan
    slotDuration: '00:30:00',
    slotLabelInterval: '00:30',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24 saat formatı
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24 saat formatı
    }
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef, 
    private workingTimeService: WorkingtimesService,
    private clinicService: ClinicsService,
    public dialog: MatDialog,
    private noWorkHourService: NoworkhoursService
  ) {
    this.initializeCalendarOptions();
    this.workingTimeService.getWorkingHourById(1).subscribe(workingTime => console.log(workingTime));
  }

  initializeCalendarOptions() {
    const workingTimeId = 1; // Örneğin, 1 numaralı çalışma saatini alıyoruz
    
    forkJoin({
      workingTime: this.workingTimeService.getWorkingHourById(workingTimeId),
      clinic: this.clinicService.getDurationTimeById(workingTimeId + 1)
    }).subscribe(({ workingTime, clinic }) => {
      const updatedOptions = {
        ...this.calendarOptions(),
        slotMinTime: workingTime.startTime.ticks,
        slotMaxTime: workingTime.endTime.ticks,
        slotDuration: this.formatTimeFromMinutes(clinic.appointmentDuration),
        slotLabelInterval: this.formatTimeFromMinutes(clinic.appointmentDuration) // Randevu süresini buraya ekliyoruz
      };
      this.calendarOptions.set(updatedOptions);
      this.changeDetector.detectChanges();
    });
  }
  
  formatTimeFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${this.pad(hours)}:${this.pad(mins)}:00`
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(AddNoworkhourPopupComponent, {
      width: '500px',
      height: '500px',
      data: { start: selectInfo.start, end: selectInfo.end  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.addEvent({
          id: createEventId(),
          title: result.title,
          start: result.start,
          end: result.end,
          allDay: selectInfo.allDay
        });

        const requestBody: NoWorkHour[] = [
          {
            startDate: result.start,
            endDate: result.end
          }
        ];
        console.log(requestBody);

        this.noWorkHourService.addNoWorkHour(requestBody).subscribe(response => {
          console.log('NoWorkHour added:', response);
        });
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event;
    const dialogRef = this.dialog.open(AddNoworkhourPopupComponent, {
      width: '500px',
      height: '500px',
      data: { 
        title: event.title,
        start: event.start,
        end: event.end,
        details: event.extendedProps['details'] || '' // varsayılan olarak diğer bilgileri burada taşıyoruz
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        event.setProp('title', result.title);
        event.setStart(result.start);
        event.setEnd(result.end);
        event.setExtendedProp('details', result.details);
        this.changeDetector.detectChanges(); // ek bilgileri güncellemek için
      }
    });
  }
  

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
 }
