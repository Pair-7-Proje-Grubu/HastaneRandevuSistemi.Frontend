import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../features/officelocation/services/room.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { GetListRoomResponse } from '../../../features/officelocation/models/get-list-officeLocation-response';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-room-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  templateUrl: './room-dialog.component.html',
  styleUrl: './room-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomDialogComponent implements OnInit{
  roomNo: string = '';
  roomIdToUpdate: number | undefined;
  roomNoToUpdate: string = '';
  roomIdToDelete: number | undefined;

  rooms: GetListRoomResponse[] = [];
  selectedRoomId?: number;

  constructor(
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe(
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

  addRoom() {
    this.roomService.createRoom({ no: this.roomNo }).subscribe(
      () => {
        this.successfulMessage();
      },
      (error: HttpErrorResponse) => {
        if (error.error && error.error.Title === 'Business Rule Violation' && error.error.Type === 'BusinessException') {
          this.snackBar.open(error.error.Detail, 'Kapat', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('İŞlem gerçekleşirken bir hata oluştu!', 'Kapat', {
            duration: 5000,
          });
        }
      }
    );
  }

  updateRoom() {
    if (this.roomIdToUpdate) {
      console.log(this.roomIdToUpdate);
      console.log(this.roomNoToUpdate);
      this.roomService.updateRoom(this.roomIdToUpdate, { no: this.roomNoToUpdate }).subscribe(
        () => {
          this.successfulMessage();
        },
        (error: HttpErrorResponse) => {
          if (error.error && error.error.Title === 'Business Rule Violation' && error.error.Type === 'BusinessException') {
            this.snackBar.open(error.error.Detail, 'Kapat', {
              duration: 5000,
            });
          } else {
            this.snackBar.open('İŞlem gerçekleşirken bir hata oluştu!', 'Kapat', {
              duration: 5000,
            });
          }
        }
      );
    }
  }

  deleteRoom() {
    if (this.roomIdToDelete) {
      this.roomService.deleteRoom(this.roomIdToDelete).subscribe(
        () => {
          this.successfulMessage();
        },
        (error: HttpErrorResponse) => {
          if (error.error && error.error.Title === 'Business Rule Violation' && error.error.Type === 'BusinessException') {
            this.snackBar.open(error.error.Detail, 'Kapat', {
              duration: 5000,
            });
          } else {
            this.snackBar.open('İŞlem gerçekleşirken bir hata oluştu!', 'Kapat', {
              duration: 5000,
            });
          }
        }
      );
    }
  }

  
  successfulMessage(){
    console.log('İşlem başarılı bir şekilde gerçekleştirildi');
    this.snackBar.open('İşlem başarılı bir şekilde gerçekleştirildi!', 'Kapat', {
      duration: 5000,
    });
    this.resetForm();
  }


  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.duration = 10000;
    config.panelClass = ['custom-snackbar'];
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    this.snackBar.open(message, action, config);
  }

  resetForm() {
    this.selectedRoomId = undefined;
    this.loadRooms();
    this.cdr.markForCheck(); // Change detection tetikleme
  }
 
  closeDialog() {
    this.dialogRef.close();
  }
}
