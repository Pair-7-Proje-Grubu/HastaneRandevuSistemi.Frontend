import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { GetListBlockResponse, GetListFloorResponse, GetListRoomResponse } from '../../../features/officelocation/models/get-list-officeLocation-response';
import { RoomService } from '../../../features/officelocation/services/room.service';
import { BlockService } from '../../../features/officelocation/services/block.service';
import { FloorService } from '../../../features/officelocation/services/floor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-dynamic-dialog-office',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  templateUrl: './dynamic-dialog-office.component.html',
  styleUrl: './dynamic-dialog-office.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDialogOfficeComponent implements OnInit {
  title: string = '';
  items: GetListRoomResponse[] | GetListBlockResponse[] | GetListFloorResponse[] = [];
  newItem: string = '';
  itemIdToUpdate: number | undefined;
  itemNoToUpdate: string = '';
  itemIdToDelete: number | undefined;

  constructor(
    private roomService: RoomService,
    private blockService: BlockService,
    private floorService: FloorService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DynamicDialogOfficeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string }
  ) {}

  ngOnInit(): void {
    this.setTitleAndLoadItems();
  }

  setTitleAndLoadItems() {
    switch (this.data.type) {
      case 'block':
        this.title = 'Blok Düzenle';
        this.loadItems(this.blockService.getBlocks());
        break;
      case 'floor':
        this.title = 'Kat Düzenle';
        this.loadItems(this.floorService.getFloors());
        break;
      case 'room':
        this.title = 'Oda Düzenle';
        this.loadItems(this.roomService.getRooms());
        break;
      default:
        break;
    }
  }

  loadItems(serviceCall: Observable<any>) {
    serviceCall.subscribe(
      (data: any) => {
        this.items = data;
        this.cdr.markForCheck();
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching items: ', error);
      }
    );
  }

  addItem() {
    const serviceCall = this.getServiceCall('create', { no: this.newItem });
    serviceCall.subscribe(
      () => this.handleSuccess(),
      (error: HttpErrorResponse) => this.handleError(error)
    );
  }

  updateItem() {
    if (this.itemIdToUpdate) {
      console.log(this.itemIdToUpdate);
      const serviceCall = this.getServiceCall('update', { no: this.itemNoToUpdate }, this.itemIdToUpdate);
      serviceCall.subscribe(
        () => this.handleSuccess(),
        (error: HttpErrorResponse) => this.handleError(error)
      );
    }
  }

  deleteItem() {
    if (this.itemIdToDelete) {
      console.log(this.itemIdToDelete);
      const serviceCall = this.getServiceCall('delete', null, this.itemIdToDelete);
      serviceCall.subscribe(
        () => this.handleSuccess(),
        (error: HttpErrorResponse) => this.handleError(error)
      );
    }
  }

  getServiceCall(action: string, data?: any, id?: number): Observable<any> {
    switch (this.data.type) {
      case 'block':
        if (action === 'create') return this.blockService.createBlock({ no: this.newItem });
        if (action === 'update') return this.blockService.updateBlock(this.itemIdToUpdate!, { no: this.itemNoToUpdate });
        if (action === 'delete') return this.blockService.deleteBlock(this.itemIdToDelete!);
        break;
      case 'floor':
        if (action === 'create') return this.floorService.createFloor({ no: this.newItem });
        if (action === 'update') return this.floorService.updateFloor(this.itemIdToUpdate!, { no: this.itemNoToUpdate });
        if (action === 'delete') return this.floorService.deleteFloor(this.itemIdToDelete!);
        break;
      case 'room':
        if (action === 'create') return this.roomService.createRoom({ no: this.newItem });
        if (action === 'update') return this.roomService.updateRoom(this.itemIdToUpdate!, { no: this.itemNoToUpdate });
        if (action === 'delete') return this.roomService.deleteRoom(this.itemIdToDelete!);
        break;
      default:
        break;
    }
    return new Observable<any>();
  }

  handleSuccess() {
    this.snackBar.open('İşlem başarılı bir şekilde gerçekleştirildi!', 'Kapat', {
      duration: 5000,
    });
    this.resetForm();
  }

  handleError(error: HttpErrorResponse) {
    if (error.error && error.error.Title === 'Business Rule Violation' && error.error.Type === 'BusinessException') {
      this.snackBar.open(error.error.Detail, 'Kapat', {
        duration: 5000,
      });
    } else {
      this.snackBar.open('İşlem gerçekleşirken bir hata oluştu!', 'Kapat', {
        duration: 5000,
      });
    }
  }

  resetForm() {
    this.newItem = '';
    this.itemIdToUpdate = undefined;
    this.itemNoToUpdate = '';
    this.itemIdToDelete = undefined;
    this.setTitleAndLoadItems();
  }

  closeDialog() {
    this.dialogRef.close(true); // Dialog kapanırken true değeri döndürülüyor
  }
}