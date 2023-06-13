import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs'; 

import { MessageService } from '../../services/message.service'; 
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

    constructor(private messenger: MessageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('HttpRequest', req);
        const started = Date.now();
        let ok: string;

        const contentTypeHeader = new HttpHeaders().set('Content-Type', 'application/json');

        const clonedRequest = req.clone({
            headers: req.headers.set('Content-Type', 'application/json')
        });

        // extend server response observable with logging
        return next.handle(clonedRequest)
        .pipe(
            tap({
                // Succeeds when there is a response; ignore other events
                next: (event) => {(ok = event instanceof HttpResponse ? 'succeeded' : '')},
                // Operation failed; error is an HttpErrorResponse
                error: (error) => (ok = 'failed')
            }),
            // Log when response observable either completes or errors
            finalize(() => {
                const elapsed = Date.now() - started;
                const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
                this.messenger.add(msg);

                console.log(msg);
            }),
            catchError((error: any) => {
                console.error(error);
                this.messenger.add(error);
                return throwError(error);
            })
        );
    }
}