import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  signupAction(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this._dialog.open(SignupComponent, dialogConfig);
  }

  forgotPasswordAction(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this._dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  loginAction(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this._dialog.open(LoginComponent, dialogConfig);
  }
}
