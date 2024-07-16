import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PagedResponse } from '../../../features/pagination/models/paged-response';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { FeedbacksService } from '../services/feedbacks.service';
import { Feedback } from '../models/feedback';

@Component({
  selector: 'app-all-feedback',
  standalone: true,
  imports: [AgGridModule, AgGridAngular, PaginationComponent],
  templateUrl: './all-feedback.component.html',
  styleUrl: './all-feedback.component.scss'
})
export class AllFeedbackComponent implements OnInit {
  feedbackList: PagedResponse<Feedback> = {
    data: [],
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0
  };
  pageNumber: number = 1;
  pageSize: number = 9;
  totalRecords: number = 0

  // pagination: true = true;
  // paginationPageSize = 10;
  // paginationPageSizeSelector = [5, 10, 15, 20, 25, 50, 75, 100]

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    autoHeight: true,
    wrapText: true
  };

  colDefs: ColDef[] = [
    { headerName: 'User Mail', field: 'userMail' },
    { headerName: 'User Feedback', field: 'userFeedback' },
    { headerName: 'Created Date', field: 'createdDate', cellRenderer: (data: { value: string | number | Date; }) => { return data.value ? (new Date(data.value)).toLocaleString() : '' } }
  ];

  constructor(private feedbackService: FeedbacksService, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    this.getFeedbackData();
  }

  onPageChange(newPage: number): void {
    console.log('Değişen', newPage);
    this.pageNumber = newPage;
    this.getFeedbackData();
}

  getFeedbackData(): void {
    this.feedbackService.getAllFeedbacks(this.pageNumber, this.pageSize).subscribe(
      (data: PagedResponse<Feedback>) => {
        this.feedbackList = data;
        console.log(data);
        this.cdr.detectChanges();
      }
    );
  }
}