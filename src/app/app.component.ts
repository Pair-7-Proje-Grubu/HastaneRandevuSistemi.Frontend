import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CardComponent } from './shared/components/card/card.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,CardComponent,LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'HastaneRandevuSistemi.Frontend';
  randevusayisi = "20";
}
