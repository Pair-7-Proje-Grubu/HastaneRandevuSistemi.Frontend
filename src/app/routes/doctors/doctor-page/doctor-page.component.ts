import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseLayoutComponent } from '../../../shared/components/base-layout/base-layout.component';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [
    CommonModule,
    BaseLayoutComponent,
  ],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorPageComponent { }
