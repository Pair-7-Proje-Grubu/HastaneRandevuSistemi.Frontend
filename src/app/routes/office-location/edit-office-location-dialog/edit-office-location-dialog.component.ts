import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { GetListBlockResponse, GetListFloorResponse, GetListOfficeLocationResponse, GetListRoomResponse } from '../../../features/officelocation/models/get-list-officeLocation-response';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OfficeLocationService } from '../../../features/officelocation/services/officeLocation.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BlockService } from '../../../features/officelocation/services/block.service';
import { RoomService } from '../../../features/officelocation/services/room.service';
import { FloorService } from '../../../features/officelocation/services/floor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-office-location-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './edit-office-location-dialog.component.html',
  styleUrl: './edit-office-location-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOfficeLocationDialogComponent implements OnInit {
  blocks: GetListBlockResponse[] = [];
  floors: GetListFloorResponse[] = [];
  rooms: GetListRoomResponse[] = [];
  selectedBlockId?: number;
  selectedFloorId?: number;
  selectedRoomId?: number;

  constructor(
    public dialogRef: MatDialogRef<EditOfficeLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private officeLocationService: OfficeLocationService,
    private blockService: BlockService,
    private roomService: RoomService,
    private floorService: FloorService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBlocks();
  }

  loadBlocks(): void {
    this.blockService.getBlocks().subscribe(
      (data: GetListBlockResponse[]) => {
        this.blocks = data;
        this.selectedBlockId = this.data.blockId;
        this.loadFloors();
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching blocks: ', error);
      }
    );
  }

  loadFloors() {
    if (!this.selectedBlockId) return;
    this.floorService.getFloors().subscribe(
      (data: GetListFloorResponse[]) => {
        this.floors = data;
        this.selectedFloorId = this.data.floorId; 
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
    this.roomService.getRooms().subscribe(
      (data: GetListRoomResponse[]) => {
        this.rooms = data;
        this.selectedRoomId = this.data.roomId; 
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching rooms: ', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }

  onSubmit() {
    const updatedOfficeLocation = {
      id: this.data.id,
      blockId: this.selectedBlockId,
      floorId: this.selectedFloorId,
      roomId: this.selectedRoomId
    };
    console.log(updatedOfficeLocation);
    this.officeLocationService.updateOfficeLocation(updatedOfficeLocation).subscribe(
      () => {
        console.log('Güncelleme işlemi başarılı.');
        this.snackBar.open('Güncelleme işlemi başarılı!', 'Kapat', {
          duration: 5000,
        });
        this.dialogRef.close(updatedOfficeLocation);
      },
      (error: HttpErrorResponse) => {
        if (error.error && error.error.Title === 'Business Rule Violation' && error.error.Type === 'BusinessException') {
          this.snackBar.open(error.error.Detail, 'Kapat', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('Güncelleme işlemi gerçekleşirken bir hata oluştu!', 'Kapat', {
            duration: 5000,
          });
        }
      }
    );
  }
}