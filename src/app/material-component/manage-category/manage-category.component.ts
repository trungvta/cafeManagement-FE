import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  displayedColumn: string[] = ['name', 'edit'];
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

  }

}
