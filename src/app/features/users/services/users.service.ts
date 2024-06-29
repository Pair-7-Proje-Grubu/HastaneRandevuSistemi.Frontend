import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../core/browser/services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService, AuthService as CoreAuthService } from '../../../core/auth/services/auth.service';
import { ChangeCredentials } from '../models/change-credentials';


@Injectable({
  providedIn: 'root'
})
export class UsersService extends CoreAuthService{
  private readonly apiControllerUrl = `${environment.apiUrl}/User`;

  constructor(
    private http: HttpClient,
    localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    super(localStorageService);
  }

  changePassword(changeCredentials:ChangeCredentials): Observable<any> {
    console.log(this.apiControllerUrl);
    return this.http.post(`${this.apiControllerUrl}/change-password`,changeCredentials);
  }
}
