import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable()
export abstract class JsonParser {
  abstract parse(text: string): any;
}

@Injectable()
export class JsonParserCustom implements JsonParser {
  parse(text: string): any {
    return JSON.parse(text, (key: any, value: any) => {
        dateReviver(key, value);
    });
  }
}

let dateReviver = (key: any, value: any) => {
    if (typeof value === 'string') {
        const match = /\/Date\((\d+)\)\//.exec(value);
        if (match) {
          return new Date(+match[1]);
        } else {
          return null;
        }
    }
    return value;
}

@Injectable()
export class CustomJsonInterceptor implements HttpInterceptor {
    constructor(
        private _jsonParser: JsonParser,
        private _jsonParserCustom: JsonParserCustom
    ) {}

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler) {
        if (httpRequest.responseType === 'json') {
        // If the expected response type is JSON then handle it here.
        return this.handleJsonResponse(httpRequest, next);
        } else {
        return next.handle(httpRequest);
        }
    }

    private handleJsonResponse(httpRequest: HttpRequest<any>, next: HttpHandler) {
        // Override the responseType to disable the default JSON parsing.
        httpRequest = httpRequest.clone({responseType: 'text'});
        // Handle the response using the custom parser.
        return next.handle(httpRequest).pipe(map(event => this.parseJsonResponse(event)));
    }

    private parseJsonResponse(event: HttpEvent<any>) {
        if (event instanceof HttpResponse && typeof event.body === 'string') {
        return event.clone({body: this._jsonParserCustom.parse(event.body)});
        } else {
        return event;
        }
    }
  
}