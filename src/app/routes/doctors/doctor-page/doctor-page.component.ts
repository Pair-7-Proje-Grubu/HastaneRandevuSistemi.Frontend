import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-doctor-page',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './doctor-page.component.html',
  styleUrl: './doctor-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorPageComponent { }
