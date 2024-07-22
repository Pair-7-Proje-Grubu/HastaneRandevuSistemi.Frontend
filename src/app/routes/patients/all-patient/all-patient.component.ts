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

import { GetAllPatientResponse } from '../../../features/patients/models/get-all-patient-response';
import { PatientsService } from '../../../features/patients/services/patients.service';

@Component({
    selector: 'app-all-patient',
    standalone: true,
    imports: [
        CommonModule, AgGridModule, AgGridAngular,
        PaginationComponent, GenericPopupComponent, ButtonRendererGroupComponent
    ],
    templateUrl: './all-patient.component.html',
    styleUrl: './all-patient.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllPatientComponent implements OnInit {
    patientList: PagedResponse<GetAllPatientResponse> = {
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
        { headerName: 'Email', field: 'email' },
        { headerName: 'Adı', field: 'firstName' },
        { headerName: 'Soyadı', field: 'lastName' },
        { 
            headerName: 'Doğum Tarihi', 
            field: 'birthDate',
            valueFormatter: (params) => {
              if (params.value) {
                const date = new Date(params.value);
                return date.toLocaleDateString('tr-TR'); // Türkçe tarih formatı için
              }
              return '';
            }
        },
        { 
            headerName: 'Cinsiyet', 
            field: 'gender',
            valueFormatter: (params) => this.mapGender(params.value)
        },
        { 
            headerName: 'Kan Grubu', 
            field: 'bloodType',
            valueFormatter: (params) => this.mapBloodType(params.value)
          },
        { headerName: 'Yakını', field: 'emergencyContact' },
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
        private patientService: PatientsService, 
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ){}

    ngOnInit(): void {
        this.getAllPatient();
    }

    onPageChange(newPage: number): void {
        console.log('Değişen', newPage);
        this.pageNumber = newPage;
        this.getAllPatient();
    }

    getAllPatient(): void {
        this.patientService.getAllPatients(this.pageNumber, this.pageSize).subscribe(
            (data: PagedResponse<GetAllPatientResponse>) => {
                this.patientList = data;
                this.cdr.detectChanges();
            }
        )
    }

    onEditClick(params: any) {
        const formattedBirthDate = params.data.birthDate ? new Date(params.data.birthDate).toLocaleDateString('tr-TR') : '';
        const displayGender = this.mapGender(params.data.gender);
        const displayBloodType = this.mapBloodType(params.data.bloodType);

        const dialogRef = this.dialog.open(GenericPopupComponent, {
          width: '400px',
          data: {
            title: 'Hasta Düzenle',
            fields: [
              { name: 'id', value: params.data.id, hidden: true },
              { name: 'email', label: 'Email', value: params.data.email, placeholder: 'Email girin' },
              { name: 'firstName', label: 'Adı', value: params.data.firstName, placeholder: 'Adı girin' },
              { name: 'lastName', label: 'Soyadı', value: params.data.lastName, placeholder: 'Soyadı girin' },
              { name: 'birthDate', label: 'Doğum Tarihi', value: formattedBirthDate, placeholder: 'Doğum tarihini girin (GG.AA.YYYY)' },
              { 
                name: 'gender', 
                label: 'Cinsiyet', 
                value: params.data.gender,
                type: 'dropdown',
                options: [
                  { value: 'F', label: 'Kadın' },
                  { value: 'M', label: 'Erkek' },
                  { value: 'U', label: 'Belirtilmemiş' }
                ]
              },
              { 
                name: 'bloodType', 
                label: 'Kan Grubu', 
                value: params.data.bloodType,
                type: 'dropdown',
                options: [
                  { value: 1, label: 'A Rh+' },
                  { value: 2, label: 'A Rh-' },
                  { value: 3, label: 'B Rh+' },
                  { value: 4, label: 'B Rh-' },
                  { value: 5, label: 'AB Rh+' },
                  { value: 6, label: 'AB Rh-' },
                  { value: 7, label: '0 Rh+' },
                  { value: 8, label: '0 Rh-' }
                ]
              },
              { name: 'emergencyContact', label: 'Yakını', value: params.data.emergencyContact, placeholder: 'Yakını iletişim numarasını girin' },
            ]
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);

            let isoDate;
            try {
              // Türkçe tarih formatını (GG.AA.YYYY) parse edip ISO formatına çevirme
              const [day, month, year] = result.birthDate.split('.');
              isoDate = new Date(year, month - 1, day).toISOString();
            } catch (error) {
              console.error('Geçersiz tarih formatı:', result.birthDate);
              this.snackBar.open('Geçersiz tarih formatı', 'Kapat', { duration: 3000 });
              return;
            }
            const backendGender = this.mapGender(result.gender, false);
            const updatedResult = {
                ...result,
                birthDate: isoDate,
                gender: backendGender
              };

            if (result) {
              this.patientService.updatePatient(updatedResult).subscribe({next: () => {
                this.snackBar.open('Doktor başarıyla güncellendi', 'Kapat', { duration: 3000 });
                this.getAllPatient(); 
              },
              error: (error) => {
                this.snackBar.open('Doktor güncellenirken bir hata oluştu', 'Kapat', { duration: 3000 }); 
              }
            })
            }
        });
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
    
        // dialogRef.afterClosed().subscribe(result => {
        //   if (result && result.confirmDelete === 'ONAYLA') {
        //     this.doctorService.deleteDoctor(params.data.id).subscribe(
        //       () => {
        //         this.snackBar.open('Doktor başarıyla silindi', 'Kapat', { duration: 3000 });
        //         this.getDoctorList();
        //       },
        //       error => {
        //         this.snackBar.open('Doktor silinirken bir hata oluştu', 'Kapat', { duration: 3000 });
        //         console.error('Silme hatası:', error);
        //       }
        //     );
        //   }
        // });
      }

      mapGender(gender: string, toDisplay: boolean = true): string {
        if (toDisplay) {
          switch (gender) {
            case 'M': return 'Erkek';
            case 'F': return 'Kadın';
            case 'U': return 'Belirtilmemiş';
            default: return 'Bilinmiyor';
          }
        } else {
          switch (gender.toLowerCase()) {
            case 'erkek': return 'M';
            case 'kadın': return 'F';
            default: return 'U';
          }
        }
      }

      mapBloodType(bloodType: string | number): string {
        const bloodTypeMap: { [key: number]: string } = {
          1: 'A Rh+', 2: 'A Rh-', 3: 'B Rh+', 4: 'B Rh-',
          5: 'AB Rh+', 6: 'AB Rh-', 7: '0 Rh+', 8: '0 Rh-'
        };
      
        if (typeof bloodType === 'number') {
          return bloodTypeMap[bloodType];
        } else {
          return bloodType || 'Belirtilmemiş';
        }
      }
    }
 
