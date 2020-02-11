import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor { // interceptors are functions that will run in any outgoing http request
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) { // runs in outgoing request
    const authtoken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authtoken)
    });
    return next.handle(authRequest);
  }
}




