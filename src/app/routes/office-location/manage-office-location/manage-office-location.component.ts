import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { OfficeLocationService } from '../../../features/officelocation/services/officeLocation.service';
import { GetListOfficeLocationResponse } from '../../../features/officelocation/models/get-list-officeLocation-response';
import { MatIconModule } from '@angular/material/icon';
import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOfficeLocationComponent } from '../add-office-location/add-office-location.component';

@Component({
  selector: 'app-manage-office-location',
  standalone: true,
  imports: [
    CommonModule, AgGridModule, AgGridAngular,MatIconModule,MatDialogModule
  ],
  templateUrl: './manage-office-location.component.html',
  styleUrls: ['./manage-office-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOfficeLocationComponent implements OnInit { 
  officeLocationList: GetListOfficeLocationResponse[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  colDefs: ColDef[] = [
    { headerName: 'Blok No', field: 'blockNo', flex: 1 },
    { headerName: 'Kat No', field: 'floorNo', flex: 1 },
    { headerName: 'Oda No', field: 'roomNo', flex: 1 },
    {
      headerName: 'Düzenle',
      cellRenderer: 'actionCellRenderer',
      filter: false, // Filtreleme devre dışı bırakıldı
      maxWidth: 130 // Sütun genişliği daraltıldı
    }
  ];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent
  };

  constructor(private officeLocationService: OfficeLocationService, private cdr: ChangeDetectorRef,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOfficeLocationList();
  }

  getOfficeLocationList(): void {
    this.officeLocationService.getListOfficeLocation().subscribe(
      (data: GetListOfficeLocationResponse[]) => {
        this.officeLocationList = data;
        this.cdr.detectChanges();
      }
    );
  }
  onAddDialog(){
    const dialogRef = this.dialog.open(AddOfficeLocationComponent, {
      width: '405px',
      height: '463px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOfficeLocationList();
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.getOfficeLocationList();
      console.log('Diyalog kapatıldı');
    });

  };
}

