import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule, RouterOutlet } from '@angular/router';



@NgModule({
  declarations: [BaseLayoutComponent],
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    RouterOutlet,
    RouterModule
  ],
  exports: [BaseLayoutComponent,NavbarComponent],
})
export class SharedModule { }
