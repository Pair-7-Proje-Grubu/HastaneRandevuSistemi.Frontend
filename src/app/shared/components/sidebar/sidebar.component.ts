import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface MenuItem {
  number: string;
  name: string;
  icon: string;
  sublist?: SubMenuItem[];
  link?: string;
}

interface SubMenuItem {
  name: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Input() sideBarStatus: boolean = false;
  @Output() menuSelection = new EventEmitter<string>();

  selectedItem: string = '';
  selectedSubItem: string = '';

  userRoles: string[] = [];
  list: MenuItem[] = [];

  adminList: MenuItem[]= [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa fa-user-md',
      sublist: [],
      link: '/admin/dashboard'
  },
    {
        number: '2',
        name: 'Doctor',
        icon: 'fa fa-user-md',
        sublist: [
          { name: 'All Doctors', link: '/admin/all-doctor' },
          { name: 'Add Doctor', link: '#' },
          { name: 'Edit Doctor', link: '#' },
          { name: 'Doctor Profile', link: '#' },
        ]
    },
    {
        number: '3',
        name: 'Appointments',
        icon: 'fa fa-user-md',
        sublist: [
            { name: 'View Appointment', link: '#' },
            { name: 'Edit Appointment', link: '#' },
            { name: 'Book Appointment', link: '#' }
        ]
    },
    {
      number: '4',
      name: 'Patients',
      icon: 'fa fa-users',
      sublist: [
        { name: 'All Patients', link: '#' },
        { name: 'Add Patients', link: '#' },
        { name: 'Edit Patients', link: '#' },
        { name: 'Patient Profile', link: '#' },
      ]
    },
    {
      number: '5',
      name: 'Departments',
      icon: 'fa-solid fa-cart-shopping',
      sublist: [],
      link: '#' 
    },
    {
      number: '6',
      name: 'Settings',
      icon: 'fa-solid fa-gear',
      sublist: [],
      link: 'change-password-page'
    },
    {
      number: '7',
      name: 'About',
      icon: 'fa-solid fa-circle-info',
      sublist: [],
      link: '#'
    },
    {
      number: '8',
      name: 'Contact',
      icon: 'fa-solid fa-phone',
      sublist: [],
      link: '#'
    },
  ];
  doctorList: MenuItem[]=[
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa fa-user-md',
      sublist: [],
      link: '/doctor/dashboard'
  },
    {
      number: '2',
      name: 'Appointments',
      icon: 'fa fa-user-md',
      sublist: [] ,
      link:'#'
    },
    {
      number: '3',
      name: 'Doctors',
      icon: 'fa fa-user-md',
      sublist: [],
      link:'/doctor/all-doctor'
    },
    {
      number: '4',
      name: 'Patients',
      icon: 'fa fa-users',
      sublist: [] 
    },
    {
      number: '5',
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
      number: '8',
      name: 'Calendar',
      icon: 'fa fa-calendar',
      sublist: [],
      link: '/doctor/calendar'
    },
  ];
  patientList=[     {
    number: '1',
    name: 'Appointments',
    icon: 'fa fa-user-md',
    sublist: [
        { name: 'Book Appointment', link: 'book-appointment' },
    ]
}, ];

  constructor(private authService: AuthService,private route: ActivatedRoute) { }
  ngOnInit(): void {
    
      const userType = this.route.snapshot.data['role'];
      this.userRoles = this.authService.getUserRoles();

      if (userType === 'Patient' && this.userRoles.includes("Patient")) {
        this.list = this.patientList;
      } 
      else if (userType === 'Doctor'  && this.userRoles.includes("Doctor")) {
        this.list = this.doctorList;
      }
        else if (userType === 'Admin'  && this.userRoles.includes("Admin")) {
        this.list = this.adminList;
      }
  

   // Seçili olan öğeleri yerel depolamadan yükleme
   const savedSelectedItem = localStorage.getItem('selectedItem');
   const savedSelectedSubItem = localStorage.getItem('selectedSubItem');

   if (savedSelectedItem) {
     this.selectedItem = savedSelectedItem;
   }

   if (savedSelectedSubItem) {
     this.selectedSubItem = savedSelectedSubItem;
     const parentItem = this.list.find(item => item.sublist && item.sublist.some(sub => sub.name === savedSelectedSubItem));
     if (parentItem) {
       const parentItemNumber = parentItem.number;
       this.collapseOtherSubmenus(parentItemNumber);
       (document.getElementById('submenu' + parentItemNumber) as HTMLElement)?.classList.add('show');
     }
   } else {
     // İlk elemanı seçili yap
     if (this.list.length > 0 && !this.selectedItem) {
       this.onItemClick(this.list[0].name);
     }
   }

   // BaseLayoutComponent'e seçili menü öğesini gönder
   if (savedSelectedItem) {
     this.menuSelection.emit(savedSelectedItem);
     if (savedSelectedSubItem) {
       const parentItem = this.list.find(item => item.sublist && item.sublist.some(sub => sub.name === savedSelectedSubItem));
       if (parentItem) {
         this.menuSelection.emit(`${parentItem.name} -> ${savedSelectedSubItem}`);
       } else {
         this.menuSelection.emit(savedSelectedSubItem);
       }
     }
   }
}

  //Burdan sonraki metotlar: BaseLayouta seçilen menunun adını gönderme ve menude seçili alan için gerekli düzenlemeler.

  onItemClick(itemName: string) {
    this.selectedItem = itemName;
    this.selectedSubItem = '';
    localStorage.setItem('selectedItem', itemName);
    localStorage.removeItem('selectedSubItem');
    const selectedItem = this.list.find(item => item.name === itemName);
    if (selectedItem && (!selectedItem.sublist || selectedItem.sublist.length === 0)) {
      this.menuSelection.emit(itemName);
    }
  }

  onSubItemClick(subItemName: string, parentItemNumber: string) {
    this.selectedSubItem = subItemName;
    this.collapseOtherSubmenus(parentItemNumber);
    localStorage.setItem('selectedSubItem', subItemName);
    const parentItem = this.list.find(item => item.sublist && item.sublist.some(sub => sub.name === subItemName));
    if (parentItem) {
      localStorage.setItem('selectedItem', parentItem.name);
      this.menuSelection.emit(`${parentItem.name} -> ${this.selectedSubItem}`);
    } else {
      this.menuSelection.emit(this.selectedSubItem);
    }
  }

  isSelected(itemName: string): boolean {
    return this.selectedItem === itemName || this.selectedSubItem === itemName;
  }

  // Diğer açık olan menüleri kapatmak için tüm collapse elementlerini kapatın
  collapseOtherSubmenus(parentItemNumber: string) {
    const collapses = document.querySelectorAll('.collapse');
    collapses.forEach(collapse => {
      if (collapse.id !== `submenu${parentItemNumber}`) {
        (collapse as HTMLElement).classList.remove('show');
      }
    });
  }
}

