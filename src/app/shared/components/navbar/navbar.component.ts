import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() sideBarToggled= new EventEmitter<boolean>();
  menuStatus: boolean = false;

  isLogged: boolean = false;
  displayUserName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.authService.isLogged.subscribe((isLogged) => {
      this.isLogged = isLogged;
      this.displayUserName = isLogged
        ? this.authService.tokenPayload!.email
        : null;
    });
  } 

  SideBarToggle(){
    this.menuStatus = !this.menuStatus;
    this.sideBarToggled.emit(this.menuStatus);
  }
}
