import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button-renderer',
  standalone: true,
  imports: [
    CommonModule,MatIconModule, MatButtonModule
  ],
  template: `
  <!-- @if (params.predicate === undefined || params.predicate(params.data))
  {
    <button mat-icon-button color="warn" (click)="onClick($event)" class="full-height">
      <mat-icon>{{params.icon}}</mat-icon>
    </button>
  } -->
  <button mat-icon-button color="primary" (click)="onEditClick($event)">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button color="warn" (click)="onDeleteClick($event)">
      <mat-icon>delete</mat-icon>
    </button>
  `,
  styleUrl: './button-renderer.component.scss',
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onClick(event: Event) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: event,
        rowData: this.params.node.data
      }
      this.params.onClick(params);
    }
  }

  onEditClick(event: Event) {
    if (this.params.onEdit instanceof Function) {
      const params = {
        event: event,
        rowData: this.params.node.data
      }
      this.params.onEdit(params);
    }
  }

  onDeleteClick(event: Event) {
    if (this.params.onDelete instanceof Function) {
      const params = {
        event: event,
        rowData: this.params.node.data
      }
      this.params.onDelete(params);
    }
  }
}