import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../core/browser/services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService, AuthService as CoreAuthService } from '../../../core/auth/services/auth.service';
import { ChangeCredentials } from '../models/change-credentials';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends CoreAuthService {
  private readonly apiControllerUrl = `${environment.apiUrl}/User`;

  constructor(
    private http: HttpClient,
    localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    super(localStorageService);
  }

  changePassword(changeCredentials: ChangeCredentials): Observable<any> {
    console.log('API Controller URL:', this.apiControllerUrl);
    return this.http.post(`${this.apiControllerUrl}/change-password`, changeCredentials, { responseType: 'text' })
      .pipe(
        map(response => {
          try {
            return JSON.parse(response);
          } catch (error) {
            return { isSuccess: true, message: response };
          }
        }),
        catchError(this.handleError)
      );
  }

  getUserPhoneNumber(email: string): Observable<string> {
    return this.http.get(`${this.apiControllerUrl}/get-phone-number/${email}`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  changePhoneNumber(email: string, newPhone: string): Observable<any> {
    const body = { email, newPhone };
    return this.http.post(`${this.apiControllerUrl}/change-phone-number`, body)
      .pipe(
        map(response => {
          if (typeof response === 'string') {
            try {
              return JSON.parse(response);
            } catch (error) {
              return { isSuccess: true, message: response };
            }
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Bir hata oluştu';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Hata: ${error.error.message}`;
    } else {
      errorMessage = `${error.status} kodu ile hata oluştu: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getProfile(): Observable<any> {
    return this.http.post(`${this.apiControllerUrl}/GetProfile`,{});
  }
}
