import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic';

@Injectable({
  providedIn: 'root'
})
export class ClinicsService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Clinic`;

  constructor(private http: HttpClient) { }

  getClinicById(id: number): Observable<Clinic> {
    return this.http.get<Clinic>(`${this.apiControllerUrl}/${id}`);
  }

}
