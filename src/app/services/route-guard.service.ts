import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

import jwt_decode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    public _auth: AuthService,
    public _router: Router,
    private _snackbarService: SnackbarService
  ) { 
    console.log('================================================== 1');
  }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    console.log('================================================== 2');

    let expectedRoleArray = router.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: any = localStorage.getItem('token');

    console.log('token', token);

    var tokenPayload: any;
    try {
      tokenPayload = jwt_decode(token);
    }
    catch(err) {
      localStorage.clear();
      this._router.navigate(['/']);
    }

    let checkRole = false;

    for(let i=0; i< expectedRoleArray.length; i++) {
      if(expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true;
      }
    }

    if(tokenPayload.role =='user' || tokenPayload.role == 'admin') {
      if(this._auth.isAuthenticated() && checkRole) {
        return true;
      }
      this._snackbarService.openSnackBar(GlobalConstants.unauthroized, GlobalConstants.error);
      this._router.navigate(['/cafe/dashboard']);
      return false;
    } 
    else {
      this._router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
