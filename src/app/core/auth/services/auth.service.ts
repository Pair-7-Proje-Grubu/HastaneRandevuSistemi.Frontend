import { Injectable } from '@angular/core';
import { AccessTokenPayload } from '../models/access-token-payload';
import { LocalStorageService } from '../../browser/services/local-storage.service';
import { ACCESS_TOKEN_KEY } from '../constants/auth-keys';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Subject'ler Observable'in alt sınıfıdır. Kendi çağrılarımızı -next, error, complete- yapabiliriz. Bu observable yapıya subscribe olan dinleyiciler, subscribe olduktan sonraki çağrıları alabilirler. 
  // @Output'a benzer.
  protected _logged = new Subject<void>();
  public logged: Observable<void> = this._logged.asObservable();

  protected _loggedOut = new Subject<void>();
  public loggedOut: Observable<void> = this._loggedOut.asObservable();

  // BehaviorSubject, bir değer tutar ve bu değeri subscribe olanlara anında mevcut değeri verir. Yeni bir değer yayınlandığında, bu değeri değiştirir ve subscribe olan herkese yeni değeri yayınlar. // Redux'taki store'a benzer.
  protected _isLogged = new BehaviorSubject<boolean>(this.isAuthenticated);
  public isLogged: Observable<boolean> = this._isLogged.asObservable();

  constructor(protected localStorageService: LocalStorageService) {}

  public get token(): string | null {
    return this.localStorageService.get<string>(ACCESS_TOKEN_KEY);
  }

  public get tokenPayload(): AccessTokenPayload | null {
    if (!this.token) return null;

    const token = this.token;
    // const [header, payload, signature] = token.split('.');
    const [, payload] = token.split('.');

    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload) as AccessTokenPayload;

    return parsedPayload;
  }

  logout(): void {
    this.localStorageService.remove(ACCESS_TOKEN_KEY);
    localStorage.removeItem('selectedItem');
    localStorage.removeItem('selectedSubItem');
    this._loggedOut.next(); // next: Yeni bir event yayınlar, varsa yeni değeri de içerebilir.
    // error(); // error: Observable'a hata ekler.
    // complete(); // complete: Observable'ı tamamlar, artık yeni değer yayınlamaz.
    this._isLogged.next(false);
  }

  get isAuthenticated(): boolean {
    if (!this.token) return false;
    console.log(this.tokenPayload?.exp, Date.now());
    if ((this.tokenPayload?.exp ?? 0) < Date.now() / 1000) {
      this.logout();
      return false;
    }

    return true;
  }

  isAuthorized(role: string): boolean {
    const token = this.token;
    if (!token) return false;
  
    const [, payload] = token.split('.');
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);
  
    const roles: string[] = parsedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
    return roles.includes(role);
  }

  getUserRoles(): string[]{
    const token = this.token;
    if (!token) return [];

    const [, payload] = token.split('.');
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    const roles: string[] = parsedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
    const roleLists = (typeof roles === 'string') ? [roles] : roles;
    console.log('Roles:', roleLists);
    return roles;
  }

  getEmailToken(): string | null {
    const token = this.token;
    if (!token) return null;

    const [, payload] = token.split('.');
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    
    const email = parsedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || [];
    console.log('Email:', email);
    return email;
  }
}
