import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import { AuthService } from '../../../core/auth/services/auth.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetListDoctorResponse } from '../../../features/doctors/models/get-list-doctor-response';
import { DoctorService } from '../../../features/doctors/services/doctor.service';
import { ButtonRendererGroupComponent } from '../../../shared/components/button-group-renderer/button-group-renderer.component';

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
    { headerName: 'Telefon', field: 'phone' },
    {
      field: 'actions',
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
    },
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
    console.log('Edit clicked for:', params.data);
    // Düzenleme mantığınızı buraya ekleyin
  }

  onDeleteClick(params: any) {
    console.log('Delete clicked for:', params.data);
    // Silme mantığınızı buraya ekleyin
  }
}
