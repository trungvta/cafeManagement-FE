import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ProductService } from 'src/app/services/product.service';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _ngxService: NgxUiLoaderService,
    private _snackbarService: SnackbarService,
    private _productService: ProductService
  ) { }

  ngOnInit(): void {
    this._ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this._productService.get().subscribe({
      next: (res: any) => {

        console.log(res)
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
    const dialogRef = this._dialog.open(ProductComponent, dialogConfig);
    this._router.events.subscribe(_ => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe(_ => {
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
    const dialogRef = this._dialog.open(ProductComponent, dialogConfig);
    this._router.events.subscribe(_ => {
      dialogRef.close();
    });
    
    const sub = dialogRef.componentInstance.onEditProduct.subscribe(_ => {
      this.tableData();
    });
  }

  handleDeleteAction(element: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete' + element.name + 'product'
    };

    const dialogRef = this._dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((_: any) => {
      this._ngxService.start();
      this.deleteProduct(element.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: number): void {
    this._productService.delete(id).subscribe({
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
