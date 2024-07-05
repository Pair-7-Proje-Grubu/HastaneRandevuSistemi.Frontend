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

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Appointment`;

  constructor(private http: HttpClient) { }

  getListAvailableAppointment(requestBody:ListAvailableAppointmentRequest): Observable<ListAvailableAppointmentResponse> {
    return this.http.post<ListAvailableAppointmentResponse>(`${this.apiControllerUrl}/GetListAvailableAppointments`,requestBody);
  }

  getListActiveAppointmentByDoctor(): Observable<ListAppointmentByDoctorResponse[]> {
    return this.http.post<ListAppointmentByDoctorResponse[]>(`${this.apiControllerUrl}/GetListActiveAppointmentByDoctor`, {});
  }

  getListPastAppointmentByDoctor(): Observable<ListAppointmentByDoctorResponse[]> {
    return this.http.post<ListAppointmentByDoctorResponse[]>(`${this.apiControllerUrl}/GetListPastAppointmentByDoctor`, {});
  }

  getListPatientByDoctor(): Observable<GetListPatientByDoctorResponse[]> {
    return this.http.post<GetListPatientByDoctorResponse[]>(`${this.apiControllerUrl}/GetListPatientByDoctor`, {});
  }

  getListAppointment(): Observable<GetListAppointmentResponse[]> {
    return this.http.post<GetListAppointmentResponse[]>(`${this.apiControllerUrl}/List`, {});
  }

  bookAvailableAppointment(requestBody:BookAppointmentRequest): Observable<any> {
    return this.http.post(`${this.apiControllerUrl}/Book`,requestBody);
  }
}