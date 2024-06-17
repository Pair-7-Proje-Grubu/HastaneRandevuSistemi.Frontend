import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {                                  // Veri girişi için
  @Input() cardTitle: string = 'Default card title';          
  @Input() cardContent: string = 'Default card content'; 
  @Input() cardHeader: string = 'Default header';
  @Input() cardStyle: any = {};                               // Dinamik stiller için, renk vs.

  }

