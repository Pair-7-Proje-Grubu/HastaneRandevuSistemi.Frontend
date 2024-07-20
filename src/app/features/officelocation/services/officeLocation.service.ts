import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetListOfficeLocationResponse } from '../models/get-list-officeLocation-response';

@Injectable({
  providedIn: 'root'
})
export class OfficeLocationService {

  private readonly apiControllerUrl = `${environment.apiUrl}/OfficeLocation`;

  constructor(private http: HttpClient) { }

  createOfficeLocation(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiControllerUrl}/Add`, data);
  }

  getListOfficeLocation(): Observable<GetListOfficeLocationResponse[]> {
    return this.http.get<GetListOfficeLocationResponse[]>(`${this.apiControllerUrl}/GetList`, {});
  }

  deleteOfficeLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiControllerUrl}/${id}`);
  }

  updateOfficeLocation(officeLocation: any): Observable<void> {
    return this.http.put<void>(`${this.apiControllerUrl}/Update`, officeLocation);
  }
}
