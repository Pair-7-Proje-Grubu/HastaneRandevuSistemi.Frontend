import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/loading-overlay/services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [
    CommonModule,AsyncPipe,
  ],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent implements OnInit {
  loading$!: Observable<boolean>;

  
  constructor(
    private loadingService: LoadingService) {
    }

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
  }
}
