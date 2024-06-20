import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkingTime } from '../models/workingtime';

@Injectable({
  providedIn: 'root'
})
export class WorkingtimesService {
  private readonly apiControllerUrl = `${environment.apiUrl}/workingtime`;

  constructor(private http: HttpClient) { }

  getWorkingHourById(id: number): Observable<WorkingTime> {
    return this.http.get<WorkingTime>(`${this.apiControllerUrl}/${id}`);
  }
}
