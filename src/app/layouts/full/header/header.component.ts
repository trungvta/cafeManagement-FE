import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  role: any;

  constructor(
    private _router: Router,
    private _dialog: MatDialog
    ) {

  }

  logout(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout'
    };
    const dialogRef = this._dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user: any) => {
      console.log('AppHeaderComponent', user);
      dialogRef.close();
      localStorage.clear();
      this._router.navigate(['/']);
    });
  }

  changePassword(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this._dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
