import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = FormGroup;
  responseMessage: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _dialogRef: MatDialogRef<LoginComponent>,
    private _ngxServices: NgxUiLoaderService,
    private _snackbarService: SnackbarService,
    private _userService: UserService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.makeForm();
  }

  makeForm(): void {
    this.form = this._formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit(data: any): void {
    
    const body = data.value;
    console.log(body);

    this._ngxServices.start();
    this._userService.login(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);

        this._ngxServices.stop();
      },
      complete: () => {
        this._ngxServices.stop();
        this._dialogRef.close();
        this._router.navigate(['/cafe/dashboard']);
      }
    })
  }

}
