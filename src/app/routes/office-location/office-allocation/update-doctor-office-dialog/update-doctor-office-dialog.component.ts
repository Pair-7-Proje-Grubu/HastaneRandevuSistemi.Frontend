import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { GetListBlockResponse, GetListFloorResponse, GetListRoomResponse } from '../../../../features/officelocation/models/get-list-officeLocation-response';
import { MAT_DIALOG_DATA,MatDialog,MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '../../../../features/doctors/services/doctor.service';
import { BlockService } from '../../../../features/officelocation/services/block.service';
import { RoomService } from '../../../../features/officelocation/services/room.service';
import { FloorService } from '../../../../features/officelocation/services/floor.service';
import { HttpErrorResponse } from '@angular/common/http';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-doctor-office-dialog',
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
  templateUrl: './update-doctor-office-dialog.component.html',
  styleUrl: './update-doctor-office-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateDoctorOfficeDialogComponent implements OnInit {
  blocks: GetListBlockResponse[] = [];
  floors: GetListFloorResponse[] = [];
  rooms: GetListRoomResponse[] = [];
  officeLocationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateDoctorOfficeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private blockService: BlockService,
    private roomService: RoomService,
    private floorService: FloorService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.officeLocationForm = this.fb.group({
      fullName: [{ value: this.data.fullName, disabled: true }],
      blockId: [this.data.blockId],
      floorId: [this.data.floorId],
      roomId: [this.data.roomId],
    });
  }

  ngOnInit(): void {
    this.loadBlocks();
  }

  loadBlocks(): void {
    this.blockService.getBlocks().subscribe(
      (data: GetListBlockResponse[]) => {
        this.blocks = data;
        this.loadFloors();
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching blocks: ', error);
      }
    );
  }

  loadFloors() {
    if (!this.officeLocationForm.value.blockId) return;
    this.floorService.getFloors().subscribe(
      (data: GetListFloorResponse[]) => {
        this.floors = data;
        this.loadRooms();
        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error fetching floors: ', error);
      }
    );
  }

  loadRooms() {
    if (!this.officeLocationForm.value.floorId) return;
    this.roomService.getRooms().subscribe(
      (data: GetListRoomResponse[]) => {
        this.rooms = data;
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
      doctorId: this.data.doctorId,
      blockId: this.officeLocationForm.value.blockId,
      floorId: this.officeLocationForm.value.floorId,
      roomId: this.officeLocationForm.value.roomId
    };
    console.log(updatedOfficeLocation);
    this.doctorService.updateDoctorOfficeLocation(updatedOfficeLocation).subscribe(
      () => {
        console.log('Güncelleme işlemi başarılı.');
        this.snackBar.open('Güncelleme işlemi başarılı!', 'Kapat', {
          duration: 5000,
        });
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