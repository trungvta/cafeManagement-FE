import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: any = FormGroup;
  responseMessage: any;

  constructor(
    private _formbuiler: FormBuilder,
    private _dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private _router: Router,
    private _userService: UserService,
    private _snackbarService: SnackbarService,
    private _ngxService: NgxUiLoaderService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.makeForm();
  }

  makeForm(): void {
    this.form = this._formbuiler.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    });
  }

  handleSubmit(data: any): void {
    const body = data.value;

    this._userService.forgotPassword(body).subscribe({
      next: (res) => {

      },
      error: (err) => {

      },
      complete: () => {
        console.log('complete');
      }
    })
  }
}
