import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetListPatientByDoctorResponse } from '../../../features/appointments/models/get-list-patient-by-doctor-response';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [
        CommonModule, AgGridModule, AgGridAngular, PaginationComponent
    ],
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent implements OnInit {
    patientList: PagedResponse<GetListPatientByDoctorResponse> = {
        data: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0
      };
    pageNumber: number = 1;
    pageSize: number = 15;
    totalRecords: number = 0

    defaultColDef: ColDef = {
        flex: 1,
        filter: true,
        floatingFilter: true,
     };

    colDefs: ColDef[] = [
        { headerName: 'Hasta Adı', field: 'firstName' },
        { headerName: 'Hasta Soyadı', field: 'lastName' },
        { headerName: 'Kan Grubu', field: 'bloodType' },
        { headerName: 'Hasta Yakını', field: 'emergencyContact' }
    ];

    constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef){}

    ngOnInit(): void {
        this.getListPatientByDoctor();
    }

    onPageChange(newPage: number): void {
        console.log('Değişen', newPage);
        this.pageNumber = newPage;
        this.getListPatientByDoctor();
    }

    getListPatientByDoctor(): void {
        console.log(this.pageNumber);
        this.appointmentService.getListPatientByDoctor(this.pageNumber, this.pageSize).subscribe(
            (response: PagedResponse<GetListPatientByDoctorResponse>) => {
                console.log('Son gelen', response);
                this.patientList = response;
                this.totalRecords = response.totalRecords;
                this.cdr.detectChanges();
            }
        )
    }
 }
