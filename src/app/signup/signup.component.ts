import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuiler: FormBuilder,
    private router: Router,
    private userService: UserService,
    private SnackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuiler.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null, [Validators.required]],
    })
  }

  handleSubmit = (): void => {
    console.log(this.signupForm.value)

    this.ngxService.start();

    let formData = this.signupForm.value;
    let data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    };

    this.userService.signup(data).subscribe({
      next: (response) => {
        console.log('response', response);
        this.responseMessage = response?.message;
        this.SnackbarService.openSnackBar(this.responseMessage, "");
      },
      error: (err) => {
        console.log("Error")

        this.ngxService.stop();
        this.responseMessage = ((err.error?.message) ? err.error.message : GlobalConstants.genericError);
     
        this.SnackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      },
      complete: () => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.router.navigate(['/']);
      }
    })
  }

}
