import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ListAppointmentByDoctorResponse } from '../../../features/appointments/models/list-appointment-by-doctor-reponse';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';

@Component({
    selector: 'app-list-past-appointment',
    standalone: true,
    imports: [
        CommonModule, AgGridModule, AgGridAngular
    ],
    templateUrl: './list-past-appointment.component.html',
    styleUrl: './list-past-appointment.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPastAppointmentComponent implements OnInit {
    appointmentList: ListAppointmentByDoctorResponse[] = [];

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

    getPastAppointmentList(): void {
        this.appointmentService.getListPastAppointmentByDoctor().subscribe(
            (data: ListAppointmentByDoctorResponse[]) => {
                this.appointmentList = data;
                this.cdr.detectChanges();
            }
        )
    }
 }
