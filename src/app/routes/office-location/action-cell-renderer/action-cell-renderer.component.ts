import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererParams } from 'ag-grid-community';
import { OfficeLocationService } from '../../../features/officelocation/services/officeLocation.service';
import { EditOfficeLocationDialogComponent } from '../edit-office-location-dialog/edit-office-location-dialog.component';

@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [
    CommonModule, MatIconModule
  ],
  templateUrl: './action-cell-renderer.component.html',
  styleUrl: './action-cell-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCellRendererComponent{

  params: any;

  constructor(private dialog: MatDialog, private officeLocationService: OfficeLocationService, private cdr: ChangeDetectorRef) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  onEdit() {
    const dialogRef = this.dialog.open(EditOfficeLocationDialogComponent, {
       width: '405px',
      height: '463px',
      data: this.params.data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Güncellenmiş veri:', result);
        this.params.context.componentParent.getOfficeLocationList();
        this.cdr.detectChanges();
      }
    });
  }

  onDelete() {
    if (confirm(`Silme işlemini gerçekleştirmek istediğinize emin misiniz?`)) {
      this.officeLocationService.deleteOfficeLocation(this.params.data.id).subscribe(() => {
        this.params.context.componentParent.getOfficeLocationList();
      });
    }
  }
}
