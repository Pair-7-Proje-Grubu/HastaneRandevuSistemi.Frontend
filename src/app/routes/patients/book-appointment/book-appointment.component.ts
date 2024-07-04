import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
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
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ClinicsService } from '../../../features/clinics/services/clinics.service';
import { Clinic } from '../../../features/clinics/models/clinic';
import { ColDef, GridApi, SelectionChangedEvent,GridReadyEvent,  ModuleRegistry, } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DoctorService } from '../../../features/doctors/services/doctor.service';
import { GetByClinicIdDoctorResponse } from '../../../features/doctors/models/get-by-clinic-id-doctor-response';

export interface IClinicData {
  id: number,
  name: string,
}
export interface IDoctorData {
  id: number,
  titleName: string,
  firstName: string,
  lastName: string,
  gender: string,
}

export interface SelectedData {
  clinicName: string,
  doctorName: string,
  dateTime: string,
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule, MatTabsModule,MatTableModule,MatExpansionModule,CardComponent,ButtonComponent,MatIcon,AgGridAngular,AgGridModule
  ],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class BookAppointmentComponent{
  
  private clinicGridApi!: GridApi<IClinicData>;
  private doctorGridApi!: GridApi<IDoctorData>;
  selectedIndex! : number;


  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate: TemplateRef<any> | undefined;
  @ViewChild('successDialogTemplate') successDialogTemplate: TemplateRef<any> | undefined;
  @ViewChild('failedDialogTemplate') failedDialogTemplate: TemplateRef<any> | undefined;
  @ViewChild('dateMatTabGroup') tabGroup: MatTabGroup | undefined;
  @ViewChild('mainMatTabGroup') mainGroup!: MatTabGroup;

  availableAppointments: ListAvailableAppointmentResponse = {
    appointmentDuration:0,
    appointmentDates:[]
  };

  selectedData : SelectedData = {
    clinicName:"",
    doctorName:"",
    dateTime:"",
  };

  selectedDoctorId: number = 0; 


  readonly dialog = inject(MatDialog);
  


  defaultColDef: ColDef = {flex: 1,filter: true,floatingFilter: true};
  
  clinicCols: ColDef[] = [
    { headerName: 'Klinik Adı', field: 'name' },
  ];

  clinicRows: Clinic[] = [];

  listAvailableAppointmentRequest: ListAvailableAppointmentRequest = {
    doctorId: 0
  };
  

  doctorCols: ColDef[] = [

    {
      headerName: 'Adı Soyadı',
      cellRenderer: (params: any) => {
        let result : any;
        let photo : any = "";
        if (params.data.gender === 'M') {
          photo = `<img src="../../../../assets/male-icon.png" alt="Male" style="width:48px; height:48px;" />`;
        } else if (params.data.gender === 'F') {
          photo = `<img src="../../../../assets/female-icon.png" alt="Female" style="width:48px; height:48px;" />` ;
        }
        result = photo + " " + params.data.firstName + " " + params.data.lastName;
        return result;
      },
      filterValueGetter: (params: any) => `${params.data.firstName} ${params.data.lastName}`,
    },
    { headerName: 'Ünvanı', field: 'titleName' },
  ];

  doctorRows: GetByClinicIdDoctorResponse[] = [];

  constructor(private appointmentService: AppointmentService,
    private clinicService: ClinicsService,
    private doctorService: DoctorService, private cdr: ChangeDetectorRef){

  
  }

  onGridReadyClinic(params : GridReadyEvent<IClinicData> ) {
    this.clinicGridApi = params.api;

    this.clinicService.getAllClinics().subscribe(
      (data: Clinic[]) => {
        this.clinicRows = data;
        this.cdr.detectChanges();
      }
    );
    
  }

  onSelectionChangedClinic() {
    const selectedRows = this.clinicGridApi.getSelectedRows();
    if (selectedRows.length > 0)
    {
      this.doctorService.getByClinicId(selectedRows[0].id).subscribe(
        (data: GetByClinicIdDoctorResponse[]) => {
          this.doctorRows = data;
          this.mainGroup.selectedIndex = 1;
          this.mainGroup._tabs.toArray()[1].disabled = false;
          this.selectedData.clinicName = selectedRows[0].name;
          this.cdr.detectChanges();

        }
      );
    }
    else
    {
      this.selectedData.clinicName = "";
    }
  }


  onGridReadyDoctor(params : GridReadyEvent<IDoctorData> ) {
    this.doctorGridApi = params.api;
  }

  onSelectionChangedDoctor() {
    const selectedRows = this.doctorGridApi.getSelectedRows();
    if (selectedRows.length > 0 )
    {
      this.listAvailableAppointmentRequest.doctorId = selectedRows[0].id;
      this.appointmentService.getListAvailableAppointment(this.listAvailableAppointmentRequest).subscribe(response=>{
        this.availableAppointments = this.generateSlots(response);
        console.log(this.availableAppointments);
        this.mainGroup.selectedIndex = 2;
        this.selectedDoctorId = selectedRows[0].id;
        this.mainGroup._tabs.toArray()[2].disabled = false;
        this.selectedData.doctorName = selectedRows[0].firstName + " " + selectedRows[0].lastName;
        this.cdr.detectChanges();
      });
    }
    else
    {
      this.selectedData.doctorName = "";
      this.mainGroup._tabs.toArray()[2].disabled = true;
    }
    
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
        doctorId:this.listAvailableAppointmentRequest.doctorId,
        dateTime: dateTime.toISOString(),
      };
      

      this.selectedData.dateTime = dateTimeForFrontend.toString();
      console.log(this.selectedData);
      

      this.appointmentService.bookAvailableAppointment(bookAppointmentRequest).subscribe({
        next: () => {

          console.log(timeStr);
          this.availableAppointments.appointmentDates[this.tabGroup?.selectedIndex!].bookedSlots.push(timeStr + ":00");
          this.cdr.detectChanges();
          this.dialog.open(DynamicDialogComponent, {
            width: '500px',
            data: <IDynamicDialogConfig>{
              title: 'Sonuç',
              dialogContent: this.successDialogTemplate,
              acceptButtonTitle: 'Tamam',
              dialogType: 'success' 
            },
          }
        ); 

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


