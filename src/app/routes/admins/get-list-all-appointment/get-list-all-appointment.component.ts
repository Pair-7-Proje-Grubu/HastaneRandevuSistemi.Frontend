import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ButtonRendererGroupComponent } from '../../../shared/components/button-group-renderer/button-group-renderer.component';
import { GenericPopupComponent } from '../../../shared/components/generic-popup/generic-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GetListAllAppointmentResponse } from '../../../features/appointments/models/get-list-all-appointment-response';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';

@Component({
    selector: 'app-get-list-all-appointment',
    standalone: true,
    imports: [
        CommonModule, AgGridModule, AgGridAngular,
        PaginationComponent, GenericPopupComponent, ButtonRendererGroupComponent
    ],
    templateUrl: './get-list-all-appointment.component.html',
    styleUrl: './get-list-all-appointment.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetListAllAppointmentComponent {
    appointmentList: PagedResponse<GetListAllAppointmentResponse> = {
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0
    };
    pageNumber: number = 1;
    pageSize: number = 14;
    totalRecords: number = 0

    defaultColDef: ColDef = {
        flex: 1,
        filter: true,
        floatingFilter: true,
     };

     colDefs: ColDef[] = [
        { headerName: 'Hasta Adı', field: 'patientName' },
        { headerName: 'Doktor Adı', field: 'doctorName' },
        { headerName: 'Klinik', field: 'clinicName' },
        { 
            headerName: 'Randevu Tarihi', 
            field: 'dateTime',
            valueFormatter: (params) => {
              if (params.value) {
                const date = new Date(params.value);
                return date.toLocaleDateString('tr-TR'); // Türkçe tarih formatı için
              }
              return '';
            }
        },
        {
            headerName: 'İşlemler',
            cellRenderer: ButtonRendererGroupComponent,
            cellRendererParams: {
                buttons:  [
                  {
                    onClick: this.onEditClick.bind(this),
                    label: 'Düzenle',
                    icon: 'fa-solid fa-edit fa-1x',
                    color: 'primary',
                  },
                  {
                    onClick: this.onDeleteClick.bind(this),
                    label: 'Sil',
                    icon: 'fa-solid fa-user-xmark fa-1x',
                    color: 'warn',
                  }
                ]
              },
              maxWidth: 200,
              filter:false,
              resizable:false,
          }
    ];

    colDefsWithoutButtons: ColDef[] = this.colDefs.slice(0, 5); // Sadece ilk 5 sütun

    constructor(
        private appointmentService: AppointmentService, 
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ){}

    ngOnInit(): void {
        this.getAllAppointment();
    }

    onPageChange(newPage: number): void {
        console.log('Değişen', newPage);
        this.pageNumber = newPage;
        this.getAllAppointment();
    }

    getAllAppointment(): void {
        this.appointmentService.getListAppointmentByAdmin(this.pageNumber, this.pageSize).subscribe(
            (data: PagedResponse<GetListAllAppointmentResponse>) => {
                this.appointmentList = data;
                this.cdr.detectChanges();
            }
        )
    }

    onEditClick(params: any) {
        console.log('Randevu edit istendi:', params.data.id);
    }

    onDeleteClick(params: any) {
        console.log('Randevu delete istendi:', params.data.id);
    }
 }
