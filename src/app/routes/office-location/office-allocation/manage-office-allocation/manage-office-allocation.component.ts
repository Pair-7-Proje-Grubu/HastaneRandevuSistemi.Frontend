import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DoctorService } from '../../../../features/doctors/services/doctor.service';
import { GetListDoctorOfficeLocationResponse } from '../../../../features/doctors/models/get-list-doctor-officeLocation';
import { ActionCellRendererAllocationComponent } from '../action-cell-renderer-allocation/action-cell-renderer-allocation.component';


@Component({
  selector: 'app-manage-office-allocation',
  standalone: true,
  imports: [
    CommonModule, AgGridModule, AgGridAngular,MatIconModule,MatDialogModule
  ],
  templateUrl: './manage-office-allocation.component.html',
  styleUrl: './manage-office-allocation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOfficeAllocationComponent implements OnInit { 
  officeLocationList: GetListDoctorOfficeLocationResponse[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  colDefs: ColDef[] = [
    { headerName: 'Doktor Adı', field: 'fullName', flex: 1 },
    { headerName: 'Blok No', field: 'blockNo', flex: 1 },
    { headerName: 'Kat No', field: 'floorNo', flex: 1 },
    { headerName: 'Oda No', field: 'roomNo', flex: 1 },
    {
      headerName: 'Düzenle',
      cellRenderer: 'actionCellRenderer',
      filter: false, // Filtreleme devre dışı bırakıldı
      maxWidth: 100 // Sütun genişliği daraltıldı
    }
  ];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererAllocationComponent
  };

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getDoctorOfficeLocationList();
  }

  getDoctorOfficeLocationList(): void {
    this.doctorService.getDoctorListOfficeLocation().subscribe(
      (data: GetListDoctorOfficeLocationResponse[]) => {
        this.officeLocationList = data;
        this.cdr.detectChanges();
      }
    );
  }
}

