import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';
import { IDynamicDialogConfig } from '../../models/dynamic-dialog/dynamic-dialog-config';

interface Feedback {
  userMail: string;
  userFeedback: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})

export class FeedbackComponent {
  readonly dialog = inject(MatDialog);
  feedback: Feedback = { userMail: '', userFeedback: '' };

  @ViewChild('successDialogTemplate') successDialogTemplate: TemplateRef<any> | undefined;
  @ViewChild('failedDialogTemplate') failedDialogTemplate: TemplateRef<any> | undefined;

  constructor(private http: HttpClient) {}

  feedbackDialog(dialogType: any)
  {
    const dialogRef = this.dialog.open(DynamicDialogComponent, {
      width: '400px',
      data: <IDynamicDialogConfig>{
        title: 'Geri Bildirim',
        dialogContent: dialogType == "success"? this.successDialogTemplate : this.failedDialogTemplate,
        dialogType: dialogType,
        acceptButtonTitle: 'Tamam'
      }
    });
    
  }

  onSubmit(feedbackForm: NgForm) {
    this.http.post('https://localhost:7027/api/feedback/add', this.feedback)
      .subscribe(response => {
        console.log('Geri bildirim başarıyla gönderildi. Teşekkür ederiz.', response);
        this.feedbackDialog("success");
      }, error => {
        console.error('Geri bildirim gönderilirken hata oluştu.', error);
        this.feedbackDialog("failed");
      });
  }
}
