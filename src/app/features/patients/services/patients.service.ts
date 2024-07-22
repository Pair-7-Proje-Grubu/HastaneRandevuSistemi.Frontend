import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllPatientResponse } from '../models/get-all-patient-response';
import { PagedResponse } from '../../pagination/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private readonly apiControllerUrl = `${environment.apiUrl}/Patient`;

  constructor(private http: HttpClient) { }

  getAllPatients(pageNumber: number, pageSize: number): Observable<PagedResponse<GetAllPatientResponse>> {
    return this.http.get<PagedResponse<GetAllPatientResponse>>(this.apiControllerUrl + '/GetAllPatient', {
      params: {
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  updatePatient(patientData: any): Observable<any> {
    return this.http.put(`${this.apiControllerUrl}/Update`, patientData);
  }

}
