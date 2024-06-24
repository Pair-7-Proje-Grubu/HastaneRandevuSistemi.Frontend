import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Input() sideBarStatus: boolean = false;
  
  userRoles: string[] = [];
  list: any[] = [];

  adminList = [
    {
        number: '1',
        name: 'Doctor',
        icon: 'fa fa-user-md',
        sublist: [
          { name: 'All Doctors', link: '/my-account' },
          { name: 'Add Doctor', link: '#' },
          { name: 'Edit Doctor', link: '#' },
          { name: 'Doctor Profile', link: '#' },
        ]
    },
    {
        number: '2',
        name: 'Appointments',
        icon: 'fa fa-user-md',
        sublist: [
            { name: 'View Appointment', link: '#' },
            { name: 'Edit Appointment', link: '#' }
        ]
    },
    {
      number: '3',
      name: 'Patients',
      icon: 'fa fa-users',
      sublist: [
        { name: 'All Patients', link: '#' },
        { name: 'Add Patients', link: '#' },
        { name: 'Edit Patients', link: '#' },
        { name: 'Doctor Patients', link: '#' },
      ]
    },
    {
      number: '4',
      name: 'Departments',
      icon: 'fa-solid fa-cart-shopping',
      sublist: [],
      link: '/my-account' 
    },
    {
      number: '5',
      name: 'Settings',
      icon: 'fa-solid fa-gear',
      sublist: [],
      link: '#'
    },
    {
      number: '6',
      name: 'About',
      icon: 'fa-solid fa-circle-info',
      sublist: [],
      link: '#'
    },
    {
      number: '7',
      name: 'Contact',
      icon: 'fa-solid fa-phone',
      sublist: [],
      link: '#'
    },
  ];
  doctorList=[
    {
      number: '1',
      name: 'Appointments',
      icon: 'fa fa-user-md',
      sublist: [] 
    },
    {
      number: '2',
      name: 'Doctors',
      icon: 'fa fa-user-md',
      sublist: [] 
    },
    {
      number: '3',
      name: 'Patients',
      icon: 'fa fa-users',
      sublist: [] 
    },
    {
      number: '4',
      name: 'Settings',
      icon: 'fa-solid fa-gear',
      sublist: [] 
    },
    {
      number: '6',
      name: 'Chat',
      icon: 'fa fa-comments',
      sublist: [] 
    },
    {
      number: '7',
      name: 'Contact',
      icon: 'fa-solid fa-phone',
      sublist: [] 
    },
    {
      number: '7',
      name: 'Calendar',
      icon: 'fa fa-calendar',
      sublist: [] 
    },
  ];
  patientList=[  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    if (this.userRoles.includes('Doctor')) {
      this.list = this.doctorList;
    } else if (this.userRoles.includes('Admin')) {
      this.list = this.adminList;
    }
  }  
}
