import { Component, AfterViewInit, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  onAddProduct: EventEmitter<any> = new EventEmitter<any>();
  onEditProduct: EventEmitter<any> = new EventEmitter<any>();
  form: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categorys: any[] = [];
  categorysSubject$: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    public _dialogRef: MatDialogRef<ProductComponent>,
    private _categoryService: CategoryService,
    private _snackbarService: SnackbarService
    ) {
      this.categorysSubject$.subscribe((categorys: any) => {
        this.categorys = categorys;
      });
    }

  async ngOnInit(): Promise<void> {
    this.form = await this.makeForm();
    this.checkEditAction();
    this.getCategorys();
  }

  ngAfterViewInit(): void {}

  handleSubmit(data: any): void {
    this.dialogData.action === 'Add' ? this.add(data) : this.edit(data);
  }

  add(dataSubmit: any): void {
    var formData= dataSubmit;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }

    this._productService.add(data).subscribe({
      next: (response) => {
        this.responseMessage = response.message;
        this._snackbarService.openSnackBar(this.responseMessage, "success");
      },
      error: (err) => {
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      },
      complete: () => {
        this._dialogRef.close();
        this.onAddProduct.emit();
      }
    });
  }

  edit(dataSubmit: any): void {
    var formData= dataSubmit;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }

    this._productService.update(data).subscribe({
      next: (response) => {
        this.responseMessage = response.message;
        this._snackbarService.openSnackBar(this.responseMessage, "success");
      },
      error: (err) => {
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      },
      complete: () => {
        this._dialogRef.close();
        this.onEditProduct.emit();
      }
    });
  }

  getCategorys(): void {
    this._categoryService.get().subscribe({
      next: (response: any) => {
        this.categorysSubject$.next(response || []);
      },
      error: (err) => {
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      },
      complete: () => {}
    })
  }

  makeForm(): FormGroup {
    return this._formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required]
    })
  }

  checkEditAction(): void {
    if(this.dialogData?.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.form.patchValue(this.dialogData.data);
    }
  }

}
