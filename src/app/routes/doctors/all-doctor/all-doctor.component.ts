import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { forkJoin } from 'rxjs';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import { AuthService } from '../../../core/auth/services/auth.service';
import { GenericPopupComponent } from '../../../shared/components/generic-popup/generic-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { GetListDoctorResponse } from '../../../features/doctors/models/get-list-doctor-response';
import { DoctorService } from '../../../features/doctors/services/doctor.service';
import { ClinicsService } from '../../../features/clinics/services/clinics.service';
import { TitlesService } from '../../../features/titles/models/titles.service';
import { MatDialog } from '@angular/material/dialog';
import { ButtonRendererGroupComponent } from '../../../shared/components/button-group-renderer/button-group-renderer.component';

@Component({
  selector: 'app-all-doctor',
  standalone: true,
  imports: [
    CommonModule, AgGridModule, AgGridAngular, PaginationComponent, GenericPopupComponent
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
    { headerName: 'ID', field: 'id', hide: true },
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

  constructor(
    private doctorService: DoctorService, 
    private authService: AuthService,
    private clinicService: ClinicsService, 
    private titleService: TitlesService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}

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
          console.log('Gelen doktor listesi:', data.data);
            this.doctorList = data;
            this.cdr.detectChanges();
        }
    )
  }

  onEditClick(params: any) {
    console.log('Düzenlenecek doktorun ID\'si:', params.data);
    
    forkJoin({
      clinics: this.clinicService.getAllClinics(),
      titles: this.titleService.getAllTitles()
    }).subscribe(results => {
      console.log('Klinikler:', results.clinics);
      console.log('Unvanlar:', results.titles);
  
      const clinicOptions = this.createOptionsFromData(results.clinics);
      const titleOptions = this.createOptionsFromData(results.titles);
  
      const dialogRef = this.dialog.open(GenericPopupComponent, {
        width: '400px',
        data: {
          title: 'Doktor Düzenle',
          id: params.data.id,
          fields: [
            { name: 'id', value: params.data.id, hidden: true },
            { name: 'firstName', label: 'Adı', value: params.data.firstName, placeholder: 'Adı girin', readonly: true },
            { name: 'lastName', label: 'Soyadı', value: params.data.lastName, placeholder: 'Soyadı girin', readonly: true },
            { 
              name: 'clinicId', 
              label: 'Klinik', 
              value: params.data.clinicName, 
              type: 'dropdown',
              options: clinicOptions,
              selectedValue: params.data.clicnicName
            },
            { 
              name: 'titleId', 
              label: 'Unvan', 
              value: params.data.title, 
              type: 'dropdown',
              options: titleOptions,
              selectedValue: params.data.title
            },
            { name: 'phone', label: 'Telefon', value: params.data.phone, placeholder: 'Telefon numarasını girin', readonly: true },
          ]
        }
      });
  
      // Dialog kapandığında yapılacak işlemler
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          this.doctorService.updateDoctor(result).subscribe({next: () => {
            this.snackBar.open('Doktor başarıyla güncellendi', 'Kapat', { duration: 3000 });
            this.getDoctorList(); 
          },
          error: (error) => {
            this.snackBar.open('Doktor güncellenirken bir hata oluştu', 'Kapat', { duration: 3000 }); 
          }
        })
        }
      });
    });
  }
  
  createOptionsFromData(data: any[]): { value: any, label: string }[] {
    // console.log('Raw data:', data);
    const options = data.map(item => {
      const option = {
        value: item.id,
        label: item.name || item.titleName
      };
      // console.log('Created option:', option);
      return option;
    });
    // console.log('Final options:', options);
    return options;
  }

  onDeleteClick(params: any) {
    const dialogRef = this.dialog.open(GenericPopupComponent, {
      width: '400px',
      data: {
        title: 'Doktor Sil',
        fields: [
          { name: 'confirmDelete', label: 'Onay', value: '', placeholder: 'Silmek için ONAYLA yazın' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmDelete === 'ONAYLA') {
        console.log('Silinecek doktor:', params.data);
        // Burada silme işlemini gerçekleştirmek için gerekli API çağrısını yapabilirsiniz
        // Ardından, güncel listeyi almak için getDoctorList() metodunu çağırabilirsiniz
        this.getDoctorList();
      }
    });
  }
}
