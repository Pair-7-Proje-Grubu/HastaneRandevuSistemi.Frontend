import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetListDoctorResponse } from '../../../features/doctors/models/get-list-doctor-response';
import { DoctorService } from '../../../features/doctors/services/doctor.service';

@Component({
  selector: 'app-all-doctor',
  standalone: true,
  imports: [
    CommonModule, AgGridModule, AgGridAngular, PaginationComponent
  ],
  templateUrl: './all-doctor.component.html',
  styleUrl: './all-doctor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllDoctorComponent implements OnInit { 
  doctorList: PagedResponse<GetListDoctorResponse> = {
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
    { headerName: 'Adı', field: 'firstName' },
    { headerName: 'Soyadı', field: 'lastName' },
    { headerName: 'Klinik', field: 'clinicName' },
    { headerName: 'Unvan', field: 'title' },
    { headerName: 'Telefon', field: 'phone' }
  ];

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.getDoctorList();
  }

  onPageChange(newPage: number): void {
    console.log('Değişen', newPage);
    this.pageNumber = newPage;
    this.getDoctorList();
}

  getDoctorList(): void {
    this.doctorService.getListDoctor(this.pageNumber, this.pageSize).subscribe(
        (data: PagedResponse<GetListDoctorResponse>) => {
            this.doctorList = data;
            this.cdr.detectChanges();
        }
    )
  }
}
