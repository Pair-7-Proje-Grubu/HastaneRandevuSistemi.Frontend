import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ListAppointmentByDoctorResponse } from '../../../features/appointments/models/list-appointment-by-doctor-reponse';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';

@Component({
    selector: 'app-list-past-appointment',
    standalone: true,
    imports: [
    CommonModule, AgGridModule, AgGridAngular,
    PaginationComponent
],
    templateUrl: './list-past-appointment.component.html',
    styleUrl: './list-past-appointment.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPastAppointmentComponent implements OnInit {
    appointmentList: PagedResponse<ListAppointmentByDoctorResponse> = {
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
        { headerName: 'Hasta Adı', field: 'firstName' },
        { headerName: 'Hasta Soyadı', field: 'lastName' },
        { headerName: 'Randevu Tarihi', field: 'appointmentDate' }
    ];

    constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef){}

    ngOnInit(): void {
        this.getPastAppointmentList();
    }

    onPageChange(newPage: number): void {
        console.log('Değişen', newPage);
        this.pageNumber = newPage;
        this.getPastAppointmentList();
    }

    getPastAppointmentList(): void {
        this.appointmentService.getListPastAppointmentByDoctor(this.pageNumber, this.pageSize).subscribe(
            (data: PagedResponse<ListAppointmentByDoctorResponse>) => {
                this.appointmentList = data;
                this.cdr.detectChanges();
            }
        )
    }
 }
