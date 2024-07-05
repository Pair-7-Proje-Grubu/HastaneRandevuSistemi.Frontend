import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetByClinicIdDoctorResponse } from '../models/get-by-clinic-id-doctor-response';
import { GetListDoctorResponse } from '../models/get-list-doctor-response';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Doctor`;

  constructor(private http: HttpClient) { }

  getByClinicId(id: number): Observable<GetByClinicIdDoctorResponse[]> {
    return this.http.get<GetByClinicIdDoctorResponse[]>(`${this.apiControllerUrl}/GetByClinicId/${id}`);
  }

  getListDoctor(): Observable<GetListDoctorResponse[]> {
    return this.http.post<GetListDoctorResponse[]>(`${this.apiControllerUrl}/GetListDoctor`, {});
  }

}
