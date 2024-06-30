import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateNoWorkHourRequest, NoWorkHour } from '../models/create-no-work-hour-request';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoworkhoursService {

  private readonly apiControllerUrl = `${environment.apiUrl}/NoWorkHour`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // saveEvent(start: Date, end: Date) {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const body = {
  //     StartDate: start.toISOString(),
  //     EndDate: end.toISOString()
  //   };

  //   this.http.post(this.apiControllerUrl, body, { headers })
  // .pipe(
  //   catchError(error => {
  //     console.error('Error:', error);
  //     return of(error); // or any other fallback or error handling logic
  //   })
  // )
  // .subscribe(response => {
  //   console.log('Success:', response);
  // });
  // }

  addNoWorkHour(noWorkHours: NoWorkHour[]): Observable<any> {
    const doctorId: number | null = this.authService.getUserIdFromToken();
    if (doctorId === null) {
      throw new Error('Doctor ID cannot be null');
    }

    const request: CreateNoWorkHourRequest = {
      DoctorId: doctorId !== null ? doctorId : 0,
      NoWorkHours: noWorkHours
    };

    console.log(request);
    
    return this.http.post(`${this.apiControllerUrl}/Create`, request);
  }

  getListNoWorkHour(doctorId: number | null = this.authService.getUserIdFromToken()): Observable<NoWorkHour[]> {
    if (doctorId === null) {
      throw new Error('Doctor ID is null');
    }
    const params = new HttpParams().set('DoctorId', doctorId.toString());
    return this.http.get<NoWorkHour[]>(`${this.apiControllerUrl}/GetList`, { params });
  }

  deleteNoWorkHour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiControllerUrl}/${id}`);
  }
}
