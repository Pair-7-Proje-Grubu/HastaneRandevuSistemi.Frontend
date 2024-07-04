import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, SelectionChangedEvent,GridReadyEvent,  ModuleRegistry, } from 'ag-grid-community';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';
import { ClinicsService } from '../../../features/clinics/services/clinics.service';
import { GetListAppointmentResponse } from '../../../features/appointments/models/get-list-appointment-response';


@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,MatIcon,AgGridAngular,AgGridModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentListComponent { 
  private doctorGridApi!: GridApi<GetListAppointmentResponse>;
  defaultColDef: ColDef = {flex: 1,filter: true,floatingFilter: true};
  
  appointmentCols: ColDef[] = [
    { headerName: 'Doktor', field: 'doctor' },
    { 
      headerName: 'Randevu Tarihi',
      field: 'dateTime',
      // cellRenderer: (params) => {
      //   params.data.v
      // }
    },
    { headerName: 'Klinik', field: 'clinic' },
    { headerName: 'Konum', field: 'officeLocation' },
  ];

  appointmentRows: GetListAppointmentResponse[] = [];
  
  constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef){}

  
  onGridReadyAppointmentList(params : GridReadyEvent<GetListAppointmentResponse> ) {
    this.doctorGridApi = params.api;

    this.appointmentService.getListAppointment().subscribe(
      (data: GetListAppointmentResponse[]) => {
        this.appointmentRows = data;
        this.cdr.detectChanges();
      }
    );
    
  }

  onSelectionChangedAppointmentList() {
    const selectedRows = this.doctorGridApi.getSelectedRows();
    if (selectedRows.length > 0){}
  }
}
