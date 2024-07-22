import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GetListFloorResponse } from '../models/get-list-officeLocation-response';


@Injectable({
  providedIn: 'root'
})
export class FloorService {

  private readonly apiControllerUrl = `${environment.apiUrl}/Floor`;

  constructor(private http: HttpClient) { }

  getFloors(): Observable<GetListFloorResponse[]> {
    return this.http.get<GetListFloorResponse[]>(`${this.apiControllerUrl}/GetList`)
    .pipe(
      tap(data => console.log('Floors:', data)),
      
    );
  }

  createFloor(room: { no: string }): Observable<void> {
    return this.http.post<void>(`${this.apiControllerUrl}/Add`, room);
  }

  updateFloor(id: number, room: { no: string }): Observable<void> {
    return this.http.put<void>(`${this.apiControllerUrl}/Update`, room);
  }

  deleteFloor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiControllerUrl}/Delete/${id}`);
  }

}
