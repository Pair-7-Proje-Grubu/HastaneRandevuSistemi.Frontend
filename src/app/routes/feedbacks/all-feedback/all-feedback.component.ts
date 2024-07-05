import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { FeedbacksService } from '../services/feedbacks.service';
import { Feedback } from '../models/feedback';

@Component({
  selector: 'app-all-feedback',
  standalone: true,
  imports: [AgGridModule, AgGridAngular],
  template: `
  <ag-grid-angular
    class="ag-theme-quartz"
    style="height: 100vh;"
    [rowData]="feedbackList"
    [columnDefs]="colDefs"
    rowSelection="multiple"
    [pagination]="pagination"
    [paginationPageSize]="paginationPageSize"
    [paginationPageSizeSelector]="paginationPageSizeSelector"
    [defaultColDef]="defaultColDef"
    [enableCellTextSelection]="true"/>
    />
  `,
  styleUrl: './all-feedback.component.scss'
})
export class AllFeedbackComponent implements OnInit {
  feedbackList: Feedback[] = [];

  pagination: true = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 15, 20, 25, 50, 75, 100]

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

  getFeedbackData(): void {
    this.feedbackService.getAllFeedbacks().subscribe(
      (data: Feedback[]) => {
        this.feedbackList = data;
        console.log(data);
        this.cdr.detectChanges();
      }
    );
  }
}