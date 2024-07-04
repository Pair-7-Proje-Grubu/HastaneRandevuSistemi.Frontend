import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { UsersService } from '../../../features/users/services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ButtonComponent,MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarForMe:EventEmitter<any> =new EventEmitter();
  menuStatus: boolean = false;

  isLogged: boolean = false;
  displayUserName: string | null = null;

  constructor(private authService: AuthService, private router: Router,private usersService: UsersService, private cdr: ChangeDetectorRef) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.authService.isLogged.subscribe((isLogged) => {
      this.isLogged = isLogged;
      console.log("ben");
      this.usersService.getProfile().subscribe((data) => {
        this.displayUserName = data.firstName + " " +  data.lastName;
        console.log("selam" + this.displayUserName);
        this.cdr.detectChanges();
      });
    });
      // this.isLogged = isLogged;
      // this.displayUserName = isLogged
      //   ? this.authService.tokenPayload!.email
      //   : null;

        // console.log(this.authService.tokenPayload!.firstName);
    
  } 

  toggleSidebar(){
    this.toggleSidebarForMe.emit(this.menuStatus);
  }
}
