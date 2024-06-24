import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CardComponent } from './shared/components/card/card.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { AuthService } from './features/auth/services/auth.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TableComponent } from './shared/components/table/table.component';
import { DropdownListComponent } from './shared/components/dropdown-list/dropdown-list.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent,SidebarComponent,CardComponent,LoadingOverlayComponent, ButtonComponent, FooterComponent, TableComponent, DropdownListComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'HastaneRandevuSistemi.Frontend';
  sideBarStatus: boolean=false;

  dropdownItems1 = ['Option 1', 'Option 2', 'Option 3'];
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
