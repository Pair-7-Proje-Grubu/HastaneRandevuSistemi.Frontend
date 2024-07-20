import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OfficeLocationService } from '../../../features/officelocation/services/officeLocation.service';
import { GetListBlockResponse, GetListFloorResponse, GetListRoomResponse } from '../../../features/officelocation/models/get-list-officeLocation-response';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BlockService } from '../../../features/officelocation/services/block.service';
import { RoomService } from '../../../features/officelocation/services/room.service';
import { FloorService } from '../../../features/officelocation/services/floor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { DynamicDialogOfficeComponent } from '../dynamic-dialog-office/dynamic-dialog-office.component';

@Component({
  selector: 'app-add-office-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './add-office-location.component.html',
  styleUrl: './add-office-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOfficeLocationComponent implements OnInit {
  blocks: GetListBlockResponse[] = [];
  floors: GetListFloorResponse[] = [];
  rooms: GetListRoomResponse[] = [];
  selectedBlockId?: number;
  selectedFloorId?: number;
  selectedRoomId?: number;

  constructor(
    public dialogRef: MatDialogRef<AddOfficeLocationComponent>,
    private officeLocationService: OfficeLocationService,
    private blockService: BlockService,
    private RoomService: RoomService,
    private FloorService: FloorService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBlocks();
  }

  loadBlocks(): void {
    this.blockService.getBlocks().subscribe(
      (data: GetListBlockResponse[]) => {
        this.blocks = data;
        this.selectedBlockId = this.blocks[0]?.id; // Varsayılan olarak ilk elemanı seç
        this.loadFloors();
        this.cdr.markForCheck(); // Change detection tetikleme
      },
      (error) => {
        console.error('Error fetching blocks: ', error);
      }
    );
  }

  loadFloors() {
    if (!this.selectedBlockId) return;
    this.FloorService.getFloors().subscribe(
      (data: GetListFloorResponse[]) => {
        this.floors = data;
        this.selectedFloorId = this.floors[0]?.id;
        this.loadRooms();
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching floors: ', error);
      }
    );
  }

  loadRooms() {
    if (!this.selectedFloorId) return;
    this.RoomService.getRooms().subscribe(
      (data: GetListRoomResponse[]) => {
        this.rooms = data;
        this.selectedRoomId = this.rooms[0]?.id;
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching rooms: ', error);
      }
    );
  }

  onSubmit() {
    const newOfficeLocation = {
      BlockId: this.selectedBlockId,
      FloorId: this.selectedFloorId,
      RoomId: this.selectedRoomId
    };
    console.log(newOfficeLocation);
    this.officeLocationService.createOfficeLocation(newOfficeLocation).subscribe(
      () => {
        console.log('Ekleme işlemi başarılı.');
        this.snackBar.open('Ekleme işlemi başarılı!', 'Kapat', {
          duration: 5000,
        });
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        if (error.error && error.error.Title === 'Business Rule Violation' && error.error.Type === 'BusinessException') {
          this.snackBar.open(error.error.Detail, 'Kapat', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('Ekleme işlemi gerçekleşirken bir hata oluştu!', 'Kapat', {
            duration: 5000,
          });
        }
      }
    );
  }
  resetForm() {
    this.selectedBlockId = undefined;
    this.selectedFloorId = undefined;
    this.selectedRoomId = undefined;
    this.loadBlocks();
    this.loadFloors();
    this.loadRooms();
    this.cdr.markForCheck(); // Change detection tetikleme
  }

  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.duration = 10000;
    config.panelClass = ['custom-snackbar'];
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    this.snackBar.open(message, action, config);
  }
  
  openDialog(type: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.autoFocus = false;
    dialogConfig.data = { type };  // Tip bilgisini gönder
  
    const dialogRef = this.dialog.open(DynamicDialogOfficeComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch(type) {
          case 'block':
            this.loadBlocks();
            break;
          case 'floor':
            this.loadFloors();
            break;
          case 'room':
            this.loadRooms();
            break;
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }
}
