import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../../features/users/services/users.service';

interface MenuItem {
  number: string;
  name: string;
  icon: string;
  sublist?: SubMenuItem[];
  link?: string;
  disabled?: boolean;
}

interface SubMenuItem {
  name: string;
  link: string;
  disabled?: boolean;
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

  // YENİ: Profil bilgileri için özellikler
  userName: string = '';
  userAge: number = 0;
  userAvatarSrc: string = '';

  adminList: MenuItem[]= [
    {
        number: '2',
        name: 'Doktorlar',
        icon: 'fa fa-user-md',
        link: 'all-doctor' ,
    },
    {
        number: '3',
        name: 'Randevular',
        icon: 'fa fa-user-md',
        disabled:true,
        
    },
    {
      number: '4',
      name: 'Hastalar',
      icon: 'fa fa-users',
      disabled:true,
    },

    {
      number: '3',
      name: 'Geri Bildirimler',
      icon: 'fa-solid fa-comment',
      link: 'all-feedback',
    }, 
    {
      number: '5',
      name: 'Ayarlar',
      icon: 'fa-solid fa-gear',
      sublist: [],
      link: 'settings'
    }
  ];
  doctorList: MenuItem[]=[
    {
      number: '1',
      name: 'Çalışma Takvimi',
      icon: 'fa fa-calendar',
      sublist: [],
      link: 'calendar'
    },
    {
      number: '2',
      name: 'Geçmiş Randevular',
      icon: 'fa fa-user-md',
      sublist: [],
      link:'past-appointment',
    },
    {
      number: '3',
      name: 'Doktorlar',
      icon: 'fa fa-user-md',
      sublist: [],
      link:'all-doctor',
    },
    {
      number: '4',
      name: 'Hastalarım',
      icon: 'fa fa-users',
      sublist: [],
      link:'patient'
    },
    {
      number: '5',
      name: 'Ayarlar',
      icon: 'fa-solid fa-gear',
      sublist: [],
      link: 'settings'
    },
    {
      number: '6',
      name: 'Geri Bildirim',
      icon: 'fa-solid fa-comment',
      link: 'feedback',
    }, 

  ];
  patientList=[     
    {
      number: '1',
      name: 'Randevu Al',
      icon: 'fa-solid fa-calendar-plus',
      link: 'book-appointment',
    }, 
    {
      number: '2',
      name: 'Randevularım',
      icon: 'fa-solid fa-calendar-days',
      link: 'appointments',
    }, 
    {
      number: '3',
      name: 'Doktorlar',
      icon: 'fa-solid fa-users',
      link:'all-doctor',

    }, 
    {
      number: '3',
      name: 'Geri Bildirim',
      icon: 'fa-solid fa-comment',
      link: 'feedback',
    }, 
    {
      number: '4',
      name: 'Ayarlar',
      icon: 'fa-solid fa-gear',
      link: 'settings',
    }
  ];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) { }

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

    // YENİ: Profil bilgilerini yükle
    this.loadUserProfile();
  }

  // YENİ: Profil bilgilerini yükleme metodu
  loadUserProfile(): void {
    this.usersService.getProfile().subscribe({
      next: (data) => {
        this.userName = `${data.firstName} ${data.lastName}`;
        this.userAge = this.calculateAge(new Date(data.birthDate));
        this.userAvatarSrc = this.getAvatarSrc(data.gender);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Profil bilgileri yüklenirken hata oluştu:', error);
      }
    });
  }

  // YENİ: Yaş hesaplama metodu
  calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // YENİ: Avatar
  getAvatarSrc(gender: string): string {
    switch (gender.toUpperCase()) {
      case 'M':
        return '../../../../assets/male-icon.png';
      case 'F':
        return '../../../../assets/female-icon.png';
      default:
        return '../../../../assets/admin-icon.png';
    }
  }
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