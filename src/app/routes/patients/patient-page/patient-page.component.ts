import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-patient-page',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './patient-page.component.html',
  styleUrl: './patient-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientPageComponent { }
