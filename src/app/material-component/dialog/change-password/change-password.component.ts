import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { GlobalConstants } from '../../../shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

  form: any = FormGroup;
  responseMessage: any;

  constructor(
    private _formBuiler: FormBuilder,
    private _userService: UserService,
    public _dialogRef: MatDialogRef<ChangePasswordComponent>,
    public _ngxService: NgxUiLoaderService,
    private _snackbarService: SnackbarService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.makeForm();
  }

  ngAfterViewInit(): void {}

  handleSubmit(dataForm: any): void {
    this._ngxService.start();
    let formData = dataForm;
    let data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };

    this._userService.changePassword(data).subscribe({
      next: (response: any) => {
        this.responseMessage = response?.message;
        this._snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      error: (err) => {

        console.log(err);

        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      },
      complete: () => {
        this._ngxService.stop();
        this._dialogRef.close();
      }
    })
  }

  makeForm(): void {
    this.form = this._formBuiler.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });

    console.log(this.form)
  }

  validateSubmit = (): boolean => (this.form.controls['newPassword'].value !== this.form.controls['confirmPassword'].value);

}
