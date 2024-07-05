import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetListPatientByDoctorResponse } from '../../../features/appointments/models/get-list-patient-by-doctor-response';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [
        CommonModule, AgGridModule, AgGridAngular
    ],
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent {
    patientList: GetListPatientByDoctorResponse[] = [];

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

    getListPatientByDoctor(): void {
        this.appointmentService.getListPatientByDoctor().subscribe(
            (data: GetListPatientByDoctorResponse[]) => {
                this.patientList = data;
                this.cdr.detectChanges();
            }
        )
    }
 }
