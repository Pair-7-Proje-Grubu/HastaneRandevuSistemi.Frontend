import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { GetListRoomResponse } from '../models/get-list-officeLocation-response';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiControllerUrl = `${environment.apiUrl}/Room`;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<GetListRoomResponse[]> {
    return this.http.get<GetListRoomResponse[]>(`${this.apiControllerUrl}/GetList`, {});
  }
  createRoom(room: { no: string }): Observable<void> {
    return this.http.post<void>(`${this.apiControllerUrl}/Add`, room);
  }

  updateRoom(id: number, room: { no: string }): Observable<void> {
    return this.http.put<void>(`${this.apiControllerUrl}/Update`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiControllerUrl}/Delete/${id}`);
  }

}
