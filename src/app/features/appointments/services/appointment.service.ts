import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListAvailableAppointmentResponse } from '../models/list-available-appointment-response';
import { environment } from '../../../../environments/environment';
import { ListAvailableAppointmentRequest } from '../models/list-available-appointment-request';
import { BookAppointmentRequest } from '../models/book-appointment-request';
import { ListAppointmentByDoctorResponse } from '../models/list-appointment-by-doctor-reponse';
import { GetListAppointmentResponse } from '../models/get-list-appointment-response';
import { GetListPatientByDoctorResponse } from '../models/get-list-patient-by-doctor-response';
import { CancelAppointmentFromDoctorResponse } from '../models/cancel-appointment-from-doctor-response';
import { PagedResponse } from '../../pagination/models/paged-response';
import { CancelAppointmentByPatientRequest } from '../models/cancel-appointment-by-patient-request';
import { GetListAllAppointmentResponse } from '../models/get-list-all-appointment-response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Appointment`;

  constructor(private http: HttpClient) { }

  getListAvailableAppointment(requestBody:ListAvailableAppointmentRequest): Observable<ListAvailableAppointmentResponse> {
    return this.http.get<ListAvailableAppointmentResponse>(`${this.apiControllerUrl}/GetListAvailableAppointments`,{
      params: {
        doctorId: requestBody.doctorId
      }});
  }

  getListActiveAppointmentByDoctor(): Observable<ListAppointmentByDoctorResponse[]> {
    return this.http.get<ListAppointmentByDoctorResponse[]>(`${this.apiControllerUrl}/GetListActiveAppointmentByDoctor`, {});
  }

  getListPastAppointmentByDoctor(pageNumber: number, pageSize: number): Observable<PagedResponse<ListAppointmentByDoctorResponse>> {
    return this.http.get<PagedResponse<ListAppointmentByDoctorResponse>>(`${this.apiControllerUrl}/GetListPastAppointmentByDoctor`, {
      params: {
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  getListPatientByDoctor(pageNumber: number, pageSize: number): Observable<PagedResponse<GetListPatientByDoctorResponse>> {
    return this.http.get<PagedResponse<GetListPatientByDoctorResponse>>(`${this.apiControllerUrl}/GetListPatientByDoctor`, {
      params: {
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  getListAppointment(): Observable<GetListAppointmentResponse[]> {
    return this.http.get<GetListAppointmentResponse[]>(`${this.apiControllerUrl}/List`, {});
  }

  bookAvailableAppointment(requestBody:BookAppointmentRequest): Observable<any> {
    return this.http.post(`${this.apiControllerUrl}/Book`,requestBody);
  }

  cancelAppointmentFromDoctor(id: number): Observable<CancelAppointmentFromDoctorResponse> {
    return this.http.put<CancelAppointmentFromDoctorResponse>(`${this.apiControllerUrl}/CancelByDoctor/${id}`, null);
  }

  cancelAppointmentByPatient(appointmentId : number): Observable<any> {
    return this.http.put(`${this.apiControllerUrl}/CancelByPatient/${appointmentId}`,null);
  }

  getListAppointmentByAdmin(pageNumber: number, pageSize: number) : Observable<PagedResponse<GetListAllAppointmentResponse>> {
    return this.http.get<PagedResponse<GetListAllAppointmentResponse>>(`${this.apiControllerUrl}/GetListAppointmentByAdmin`, {
      params: {
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }
}