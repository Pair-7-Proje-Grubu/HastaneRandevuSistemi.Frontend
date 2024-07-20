import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { GetListRoomResponse } from '../models/get-list-officeLocation-response';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiControllerUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<GetListRoomResponse[]> {
    return this.http.get<GetListRoomResponse[]>(`${this.apiControllerUrl}/Room/GetList`, {});
  }
  createRoom(room: { no: string }): Observable<void> {
    return this.http.post<void>(`${this.apiControllerUrl}/Room/Add`, room);
  }

  updateRoom(id: number, room: { no: string }): Observable<void> {
    return this.http.put<void>(`${this.apiControllerUrl}/Room/Update`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiControllerUrl}/Room/${id}`);
  }

}
