import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from '../models/title';

@Injectable({
  providedIn: 'root'
})
export class TitlesService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Title`;
  
  constructor(private http: HttpClient) { }

  getAllTitles(): Observable<Title[]> {
    return this.http.get<Title[]>(this.apiControllerUrl + '/GetList', {});
  }
}
