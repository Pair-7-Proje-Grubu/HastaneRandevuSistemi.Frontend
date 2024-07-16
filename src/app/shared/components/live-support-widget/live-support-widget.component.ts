import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-live-support-widget',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './live-support-widget.component.html',
  styleUrls: ['./live-support-widget.component.scss']
})
export class LiveSupportWidgetComponent {
  isOpen = false;
  liveSupportUrl: SafeResourceUrl;
  isApiAvailable = true;
  isLoading = false;
  private readonly apiUrl = 'http://localhost:4201'; // LiveSupport uygulamasının çalıştığı adres

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    this.liveSupportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiUrl);
  }

  toggleWidget(): void {
    if (!this.isOpen) {
      this.isLoading = true;
      this.checkApiAvailability();
    }
    this.isOpen = !this.isOpen;
  }

  private checkApiAvailability(): void {
    this.http.get(this.apiUrl, { responseType: 'text' })
      .pipe(
        map(() => true), // Herhangi bir başarılı yanıt için true döndür
        catchError((error: HttpErrorResponse) => {
          console.error('API Error:', error);
          return of(false); // Herhangi bir hata durumunda false döndür
        })
      )
      .subscribe(
        (isAvailable: boolean) => {
          this.isApiAvailable = isAvailable;
          this.isLoading = false;
        }
      );
  }
}