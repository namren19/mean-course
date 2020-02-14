import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from 'src/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor { // interceptors are functions that will run in any outgoing http request

  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) { // runs in outgoing request

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured!';
        if (error.error.message) {
            errorMessage = error.error.message;
        }
        console.log(error);
        this.dialog.open(ErrorComponent, { data: {
          message: errorMessage
        }});
        return throwError(error); // will generate new error observable
      })
    );
  }
}




