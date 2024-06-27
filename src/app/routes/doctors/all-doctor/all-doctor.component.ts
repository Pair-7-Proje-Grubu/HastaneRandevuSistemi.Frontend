import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-all-doctor',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './all-doctor.component.html',
  styleUrl: './all-doctor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllDoctorComponent { }
