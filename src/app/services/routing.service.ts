import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  constructor(private router: Router) {}

  navigate(url: string): void {
    console.log(url)
    this.router.navigate([url]);
  }
}