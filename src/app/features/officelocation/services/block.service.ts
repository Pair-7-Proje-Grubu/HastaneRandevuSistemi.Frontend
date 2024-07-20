import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GetListBlockResponse } from '../models/get-list-officeLocation-response';


@Injectable({
  providedIn: 'root'
})
export class BlockService {

  private readonly apiControllerUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getBlocks(): Observable<GetListBlockResponse[]> {
    return this.http.get<GetListBlockResponse[]>(`${this.apiControllerUrl}/Block/GetList`);
  }

  createBlock(block: { no: string }): Observable<void> {
    return this.http.post<void>(`${this.apiControllerUrl}/Block/Add`, block);
  }

  updateBlock(id: number, block: { no: string }): Observable<void> {
    return this.http.put<void>(`${this.apiControllerUrl}/Block/Update`, block);
  }

  deleteBlock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiControllerUrl}/Block/${id}`);
  }
  
}
