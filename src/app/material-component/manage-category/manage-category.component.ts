import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
    private _dialog: MatDialog,
    private _ngxService: NgxUiLoaderService,
    private _snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this._ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this._categoryService.get().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
      },
      error: (err) => {
        this._ngxService.stop();
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
      },
      complete: () => {
        this._ngxService.stop();
      }
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  handleAddAction(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };

    dialogConfig.width = '500px';
    const dialogRef = this._dialog.open(CategoryComponent, dialogConfig);
    this._router.events.subscribe(_ => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddCategory.subscribe(_ => {
      this.tableData();
    });
  }

  handleEditAction(element: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: element
    };

    dialogConfig.width = '500px';
    const dialogRef = this._dialog.open(CategoryComponent, dialogConfig);
    this._router.events.subscribe(_ => {
      dialogRef.close();
    });
    
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(_ => {
      this.tableData();
    });
  }

  handleDeleteAction(element: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete' + element.name + 'category'
    };

    const dialogRef = this._dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((_: any) => {
      this._ngxService.start();
      this.delete(element.id);
      dialogRef.close();
    })
  }

  delete(id: number): void {
    this._categoryService.delete(id).subscribe({
      next: (response: any) => {
        this.responseMessage = response?.message;
        this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.success);
      },
      error: (err) => {
        this._ngxService.stop();
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      },
      complete: () =>{ 
        this._ngxService.stop();
        this.tableData();
      }
    })
  }

  onChange(status: any, id: number): void {

  }
}
