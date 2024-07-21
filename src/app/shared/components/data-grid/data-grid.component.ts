import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ClinicsService } from '../../../features/clinics/services/clinics.service';
import { Clinic } from '../../../features/clinics/models/clinic';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [AgGridModule, AgGridAngular],
  template: `
  <ag-grid-angular
    class="ag-theme-quartz"
    style="height: 50%;"
    [rowData]="clinicList"
    [columnDefs]="colDefs"
    rowSelection="multiple"
    [pagination]="pagination"
    [paginationPageSize]="paginationPageSize"
    [paginationPageSizeSelector]="paginationPageSizeSelector"
    [defaultColDef]="defaultColDef"
    suppressCellFocus/>
  `,
  styleUrl: './data-grid.component.scss'
})

export class DataGridComponent implements OnInit{

  clinicList: Clinic[] = [];

  pagination: true = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50, 100]

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
 };

  colDefs: ColDef[] = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Phone Number', field: 'phoneNumber' },
    { headerName: 'Appointment Duration', field: 'appointmentDuration' }
  ];

  constructor(private clinicService: ClinicsService) {
    
  }

  ngOnInit(): void {
    this.getClinicData();
  }

  getClinicData(): void {
    this.clinicService.getAllClinics().subscribe(
      (data: Clinic[]) => {
        this.clinicList = data;
        console.log(data);
      }
    );
  }

}