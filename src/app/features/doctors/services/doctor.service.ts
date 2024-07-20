import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetByClinicIdDoctorResponse } from '../models/get-by-clinic-id-doctor-response';
import { GetListDoctorResponse } from '../models/get-list-doctor-response';
import { PagedResponse } from '../../pagination/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Doctor`;

  constructor(private http: HttpClient) { }

  getByClinicId(id: number): Observable<GetByClinicIdDoctorResponse[]> {
    return this.http.get<GetByClinicIdDoctorResponse[]>(`${this.apiControllerUrl}/GetByClinicId/${id}`);
  }

  getListDoctor(pageNumber: number, pageSize: number): Observable<PagedResponse<GetListDoctorResponse>> {
    return this.http.get<PagedResponse<GetListDoctorResponse>>(`${this.apiControllerUrl}/GetListDoctor`, {
      params: {
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

}
