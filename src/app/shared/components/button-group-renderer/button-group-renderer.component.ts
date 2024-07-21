import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


export interface ButtonConfig {
  label: string;
  icon?: string;
  color?: string;
  onClick: (params: any) => void;
  predicate?: (data: any) => boolean;
}


@Component({
  selector: 'app-button-group-renderer',
  standalone: true,
  imports: [
    CommonModule,MatIconModule, MatButtonModule
  ],
  templateUrl: './button-group-renderer.component.html'
  ,
  styleUrl: './button-group-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ButtonRendererGroupComponent implements ICellRendererAngularComp {
  params!: { buttons: ButtonConfig[], data: any };

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    this.params = params;
    return true;
  }

  onClick(index: number, event: Event): void {
    event.stopPropagation();
    if (typeof this.params.buttons[index].onClick === 'function') {
      this.params.buttons[index].onClick({
        event,
        data: this.params.data
      });
    }
  }

  predicate(button: ButtonConfig, data: any): boolean {
    return button.predicate ? button.predicate(data) : true;
  }
}