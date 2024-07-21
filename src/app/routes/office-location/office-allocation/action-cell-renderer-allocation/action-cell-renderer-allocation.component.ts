import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererParams } from 'ag-grid-community';
import { UpdateDoctorOfficeDialogComponent } from '../update-doctor-office-dialog/update-doctor-office-dialog.component';

@Component({
  selector: 'app-action-cell-renderer-allocation',
  standalone: true,
  imports: [
    CommonModule, MatIconModule
  ],
  templateUrl: './action-cell-renderer-allocation.component.html',
  styleUrl: './action-cell-renderer-allocation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCellRendererAllocationComponent { 
 params: any;

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  onEdit() {
    const dialogRef = this.dialog.open(UpdateDoctorOfficeDialogComponent, {
      width: '405px',
      height: '463px',
      data: {
        fullName: this.params.data.fullName,
        doctorId: this.params.data.doctorId,
        blockId: this.params.data.blockId,
        floorId: this.params.data.floorId,
        roomId: this.params.data.roomId
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Güncellenmiş veri:', result);
        this.params.context.componentParent.getDoctorOfficeLocationList();
        this.cdr.detectChanges();
      }
    });
  }
}
