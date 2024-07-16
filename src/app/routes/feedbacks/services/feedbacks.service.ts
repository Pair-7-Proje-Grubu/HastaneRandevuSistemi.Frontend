import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback';
import { PagedResponse } from '../../../features/pagination/models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {
  private readonly apiControllerUrl = `${environment.apiUrl}/Feedback`;

  constructor(private http: HttpClient) { }

  getAllFeedbacks(pageNumber: number, pageSize: number): Observable<PagedResponse<Feedback>> {
    return this.http.get<PagedResponse<Feedback>>(this.apiControllerUrl + '/GetList', {
      params: {
        page: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }
}
