import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import { ButtonRendererComponent } from '../../../shared/components/button-renderer/button-renderer.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetListDoctorResponse } from '../../../features/doctors/models/get-list-doctor-response';
import { DoctorService } from '../../../features/doctors/services/doctor.service';

@Component({
  selector: 'app-all-doctor',
  standalone: true,
  imports: [
    CommonModule, AgGridModule, AgGridAngular, PaginationComponent, ButtonRendererComponent
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
    { headerName: 'Telefon', field: 'phone' },
    {
      headerName: 'İşlemler',
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        onEdit: this.onEditClick.bind(this),
        onDelete: this.onDeleteClick.bind(this),
      },
      width: 120 // Genişliği iki butona uygun şekilde ayarlayın
    }
  ];

  colDefsWithoutButtons: ColDef[] = this.colDefs.slice(0, 5); // Sadece ilk 5 sütun
  isAllDoctorAdminPanel = true;

  constructor(private doctorService: DoctorService, private authService: AuthService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.isAllDoctorAdminPanel = this.authService.getUserRoles().includes("Admin");
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

  onEditClick(params: any) {
    console.log('Edit clicked for:', params.rowData);
    // Düzenleme mantığınızı buraya ekleyin
  }

  onDeleteClick(params: any) {
    console.log('Delete clicked for:', params.rowData);
    // Silme mantığınızı buraya ekleyin
  }
}
