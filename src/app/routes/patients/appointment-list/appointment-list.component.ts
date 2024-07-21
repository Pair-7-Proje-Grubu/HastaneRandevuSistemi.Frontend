import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi,GridReadyEvent,ICellRendererParams,GridOptions } from 'ag-grid-community';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';
import { GetListAppointmentResponse } from '../../../features/appointments/models/get-list-appointment-response';
import { IDynamicDialogConfig } from '../../../shared/models/dynamic-dialog/dynamic-dialog-config';
import { DynamicDialogComponent } from '../../../shared/components/dynamic-dialog/dynamic-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CancelAppointmentByPatientRequest } from '../../../features/appointments/models/cancel-appointment-by-patient-request';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import { ButtonRendererGroupComponent } from '../../../shared/components/button-group-renderer/button-group-renderer.component';


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
  @ViewChild('cancelAppointmentDialogTemplate') cancelAppointmentDialogTemplate: TemplateRef<any> | undefined;
  readonly dialog = inject(MatDialog);
  private doctorGridApi!: GridApi<GetListAppointmentResponse>;
  defaultColDef: ColDef = {flex: 1,filter: true,floatingFilter: true};
  

  appointmentCols: ColDef[] = [
    { headerName: 'Durum',width: 200, maxWidth: 200, resizable:false, suppressAutoSize:false, field: 'status', 
      cellRenderer: (params: any) => {
        switch (params.value) {
          case "Scheduled":
            return  "Aktif Randevu";
  
          case "CancelByDoctor":
            return "İptal Edildi (Doktor)";
  
          case "CancelByPatient":
            return "İptal Edildi (Hasta)";
  
          case "Completed":
            return "Tamamlandı";
  
          default:
            return params.value; // Eşleşme yoksa orijinal değeri göster
        }
      },
  
      cellStyle: (params: any) => {
        switch (params.value) {
          case "Scheduled":
            return  { color: '#65ac18', fontWeight: 'bold'};
  
          case "CancelByDoctor":
            return { color: 'red', fontWeight: 'bold'};
  
          case "CancelByPatient":
            return { color: 'red' , fontWeight: 'bold'};
  
          case "Completed":
            return { color: 'dodgerblue' , fontWeight: 'bold'};
  
          default:
            return params.value; // Eşleşme yoksa orijinal değeri göster
        }
      }
  
      },
    { headerName: 'Doktor', field: 'doctor'},

    { 
      headerName: 'Randevu Tarihi',
      field: 'dateTime',  
      cellRenderer: (data: { value: string | number | Date; }) => { return data.value ? (new Date(data.value)).toLocaleString() : '' } 
    },
    { headerName: 'Klinik', field: 'clinic' },
    { headerName: 'Konum', field: 'officeLocation' },
    {
      field: 'actions',
      headerName: 'İşlemler',
      cellRenderer: ButtonRendererGroupComponent,
      cellRendererParams: {
        buttons:  [
          {
            onClick: this.onCancelClick.bind(this),
            label: 'İptal Et',
            icon: 'fa-solid fa-calendar-xmark fa-1x',
            color: 'warn',
            predicate: (appointment: any) => appointment.status === "Scheduled"
          },
        ]
      },
      maxWidth: 100,
      filter:false,
      resizable:false,
    },
    // {
      
    //   headerName: 'İptal',
    //   cellRenderer: ButtonRendererComponent,
    //   cellRendererParams: {
    //     onClick: this.onCancelClick.bind(this),
    //     label: 'İptal',
    //     icon: 'event_busy',
    //     predicate: (appointment: any) => appointment.status === "Scheduled"
    //   },
    //   resizable: false,
    //   filter:false,
    //   maxWidth: 80
    // }
  ];


  appointmentRows: GetListAppointmentResponse[] = [];
  
  constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef){}
  
  onGridReadyAppointmentList(params : GridReadyEvent<GetListAppointmentResponse> ) {
    this.doctorGridApi = params.api;

    this.appointmentService.getListAppointment().subscribe(
      (data: GetListAppointmentResponse[]) => {
        console.log(data);
        this.appointmentRows = data;
        this.cdr.detectChanges();
      }
    );
    params.api.sizeColumnsToFit();
  }

  onSelectionChangedAppointmentList() {
    const selectedRows = this.doctorGridApi.getSelectedRows();
    if (selectedRows.length > 0){}
  }
  onEditClick(params: any) {
    console.log('Randevu edit istendi:', params.data.id);
  }

  onCancelClick(params: any) {
    console.log('Randevu iptal istendi:', params.data.id);
    const dialogRef = this.dialog.open(DynamicDialogComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Randevu İptal',
        dialogContent: this.cancelAppointmentDialogTemplate,
        acceptButtonTitle: 'Onayla',
        declineButtonTitle: 'Vazgeç',
        dialogType: 'failed'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      
      this.appointmentService.cancelAppointmentByPatient(params.data.id).subscribe({
        next: () => {
          
          const index = this.appointmentRows.findIndex(appointment => appointment.id === params.data.id);
          if (index !== -1) {
            this.appointmentRows[index].status = "CancelByPatient";
            this.appointmentRows = [...this.appointmentRows]; // Angular change detection için
          }
          this.cdr.detectChanges();
      },

        error: () => {
          console.log("İptal etme işlemi başarısız oldu!");
        }
      });
    });

  }

}
