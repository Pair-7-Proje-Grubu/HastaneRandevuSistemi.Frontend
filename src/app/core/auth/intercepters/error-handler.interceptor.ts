import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';

export const errorHandlerInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Bilinmeyen bir hata oluştu!';
      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Hata: ${error.error.message}`;
      } else {
        // Server-side errors
        if (error.status === 0) {
          errorMessage = 'Sunucu aktif değil. Lütfen daha sonra tekrar deneyiniz.';
        } else {
          // errorMessage = `Hata Kodu: ${error.status}\nMesaj: ${error.message}`;
          errorMessage = `Hata oluştu, lütfen tekrar deneyiniz`;
          console.log(`Hata Kodu: ${error.status}\nMesaj: ${error.message}`);
        }
      }
      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return throwError(() => new Error(errorMessage));
    })
  );
};