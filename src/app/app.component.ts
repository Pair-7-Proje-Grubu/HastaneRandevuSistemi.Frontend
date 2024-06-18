import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CardComponent } from './shared/components/card/card.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,CardComponent,LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'HastaneRandevuSistemi.Frontend';
  randevusayisi = "20";
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.test().subscribe({
      next: (secretMessage) => {
        console.log(secretMessage);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  
}
