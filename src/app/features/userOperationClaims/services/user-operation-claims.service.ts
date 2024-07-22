import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserOperationClaim } from '../models/create-user-operation-claim';

@Injectable({
  providedIn: 'root'
})
export class UserOperationClaimsService {

  private readonly apiControllerUrl = `${environment.apiUrl}/UserOperationClaim`;

  constructor(private http: HttpClient) { }

  addUserOperationClaim(command: CreateUserOperationClaim): Observable<any> {
    return this.http.post<any>(`${this.apiControllerUrl}/Add`, command);
  }

}
