import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-live-support-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-support-widget.component.html',
  styleUrls: ['./live-support-widget.component.scss']
})
export class LiveSupportWidgetComponent implements OnInit {
  isOpen = false;
  liveSupportUrl: SafeResourceUrl;
  private readonly apiUrl = 'http://localhost:4200'; // LiveSupport uygulamasının çalıştığı adres

  constructor(private sanitizer: DomSanitizer) {
    this.liveSupportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiUrl); //Güvenilir kaynak olarak belirttik
  }

  ngOnInit(): void {
  }

  toggleWidget(): void {
    this.isOpen = !this.isOpen;
  }
}