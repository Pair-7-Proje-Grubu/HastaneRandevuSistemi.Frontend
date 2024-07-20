import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi,GridReadyEvent,ICellRendererParams,GridOptions } from 'ag-grid-community';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';
import { GetListAppointmentResponse } from '../../../features/appointments/models/get-list-appointment-response';
import { ButtonRendererComponent } from '../../../shared/components/button-renderer/button-renderer.component';
import { IDynamicDialogConfig } from '../../../shared/models/dynamic-dialog/dynamic-dialog-config';
import { DynamicDialogComponent } from '../../../shared/components/dynamic-dialog/dynamic-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
    { headerName: 'Doktor', field: 'doctor'},
    { 
      headerName: 'Randevu Tarihi',
      field: 'dateTime',
      cellRenderer: (data: { value: string | number | Date; }) => { return data.value ? (new Date(data.value)).toLocaleString() : '' } 
    },
    { headerName: 'Klinik', field: 'clinic' },
    { headerName: 'Konum', field: 'officeLocation' },
    {
      headerName: 'İptal',
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        onClick: this.onCancelClick.bind(this),
        label: 'İptal',
        icon: 'event_busy',
        predicate: (data: any) => data.cancelStatus === "NoCancel"
      },
      resizable: false,
      filter:false,
      maxWidth: 80
    }
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
    params.api.sizeColumnsToFit();
  }

  onSelectionChangedAppointmentList() {
    const selectedRows = this.doctorGridApi.getSelectedRows();
    if (selectedRows.length > 0){}
  }

  onCancelClick(appointment: GetListAppointmentResponse) {
    console.log('Randevu iptal istendi:', appointment);
    const dialogRef = this.dialog.open(DynamicDialogComponent, {
      width: '500px',
      data: <IDynamicDialogConfig>{
        title: 'Randevu İptal',
        dialogContent: this.cancelAppointmentDialogTemplate,
        acceptButtonTitle: 'Onayla',
        declineButtonTitle: 'Vazgeç',
        dialogType: 'warning'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
    //   const bookAppointmentRequest: BookAppointmentRequest = {
    //     doctorId:this.listAvailableAppointmentRequest.doctorId,
    //     dateTime: dateTime.toISOString(),
    //   };
      

    //   this.selectedData.dateTime = dateTimeForFrontend.toString();
    //   console.log(this.selectedData);
      

    //   this.appointmentService.bookAvailableAppointment(bookAppointmentRequest).subscribe({
    //     next: () => {

    //       console.log(timeStr);
    //       this.availableAppointments.appointmentDates[this.tabGroup?.selectedIndex!].bookedSlots.push(timeStr + ":00");
    //       this.cdr.detectChanges();
    //       this.dialog.open(DynamicDialogComponent, {
    //         width: '500px',
    //         data: <IDynamicDialogConfig>{
    //           title: 'Sonuç',
    //           dialogContent: this.successDialogTemplate,
    //           acceptButtonTitle: 'Tamam',
    //           dialogType: 'success' 
    //         },
    //       }
    //     ); 
    //   },

    //     error: () => {
    //       this.dialog.open(DynamicDialogComponent, {
    //         width: '500px',
    //         data: <IDynamicDialogConfig>{
    //           title: 'Sonuç',
    //           dialogContent: this.failedDialogTemplate,
    //           acceptButtonTitle: 'Tamam',
    //           dialogType: 'failed' 
    //         },
    //       }); 
    //     }
    //   });
    });

  }

}
