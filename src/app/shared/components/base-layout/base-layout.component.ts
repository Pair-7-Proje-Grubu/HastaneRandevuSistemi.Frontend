import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-base-layout',
  //standalone: true,
  //imports: [
    //CommonModule,
    //RouterOutlet,
    //NavbarComponent,
    //SidebarComponent,
    //MatSidenavModule,
    //MatToolbarModule,
    //MatMenuModule,
    //MatIconModule,
    //MatDividerModule,
    //MatListModule,
  //],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseLayoutComponent implements OnInit {
  constructor(private router: Router) { }

  sideBarOpen =true;

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  selectedMenu: string = '';

  onMenuSelection(selection: string) {
    this.selectedMenu = selection;
    localStorage.setItem('selectedMenu', selection);
  }

  ngOnInit(): void {
    const savedSelectedMenu = localStorage.getItem('selectedMenu');
    if (savedSelectedMenu) {
      this.selectedMenu = savedSelectedMenu;
    }
  }
}
