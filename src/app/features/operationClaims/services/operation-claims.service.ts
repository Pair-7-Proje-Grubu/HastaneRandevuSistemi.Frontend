import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetListOperationClaimResponse } from '../models/get-list-operationclaim-response';

@Injectable({
  providedIn: 'root'
})
export class OperationClaimsService {

  private readonly apiControllerUrl = `${environment.apiUrl}/OperationClaim`;

  constructor(private http: HttpClient) { }

  getAllOperationClaims(): Observable<GetListOperationClaimResponse[]> {
    return this.http.get<GetListOperationClaimResponse[]>(this.apiControllerUrl + '/GetList');
  }

}
