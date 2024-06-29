import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateNoWorkHourRequest, NoWorkHour } from '../models/create-no-work-hour-request';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoworkhoursService {

  private readonly apiControllerUrl = `${environment.apiUrl}/NoWorkHour/Create`;

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
    const doctorId = this.authService.getUserIdFromToken();
    const request: CreateNoWorkHourRequest = {
      DoctorId: doctorId,
      NoWorkHours: noWorkHours
    };
    return this.http.post(this.apiControllerUrl, request);
  }

}
