// import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
// import { AuthService } from "../../services/auth.service"; 

// import { Injectable } from "@angular/core";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private auth: AuthService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     const authToken = this.auth.getAuthorizationToken();

//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', authToken)
//     });
    
//     return next.handle(authReq);
//   }
// }