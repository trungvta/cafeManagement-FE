import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    private cache: Map<string, HttpResponse<any>> = new Map();

    constructor(
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // continue if not cacheable.
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        const cachedResponse = this.cache.get(req.url);
        if (cachedResponse) {
            return of(cachedResponse.clone());
        }

        return next.handle(req).pipe(
            tap(event => {
              if (event instanceof HttpResponse) {
                this.cache.set(req.url, event.clone());
              }
            })
        );
    }

}