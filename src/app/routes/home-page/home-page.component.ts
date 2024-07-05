import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FaqComponent } from '../../features/faq/faq.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    FaqComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent { 
  
}
