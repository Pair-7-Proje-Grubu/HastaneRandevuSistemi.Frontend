import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent { }
