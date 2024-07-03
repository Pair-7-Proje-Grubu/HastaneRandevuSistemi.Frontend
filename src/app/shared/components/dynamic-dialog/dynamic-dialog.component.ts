import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IDynamicDialogConfig } from '../../models/dynamic-dialog/dynamic-dialog-config';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-dynamic-dialog',
  standalone: true,
  imports: [
    CommonModule,MatDialogModule, MatButtonModule,MatIcon],
  templateUrl: './dynamic-dialog.component.html',
  styleUrl: './dynamic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class DynamicDialogComponent { 

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDynamicDialogConfig) { 
    console.log(data);
  }
}
