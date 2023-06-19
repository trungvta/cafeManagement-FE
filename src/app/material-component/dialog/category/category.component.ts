import { Inject, Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory: EventEmitter<any> = new EventEmitter<any>();
  onEditCategory: EventEmitter<any> = new EventEmitter<any>();
  form: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categorys: any[] = [];
  categorysSubject$: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _formBuilder: FormBuilder,
    private _categoryService: CategoryService,
    public _dialogRef: MatDialogRef<CategoryComponent>,
    private _snackbarService: SnackbarService
  ) { }

  async ngOnInit(): Promise<void> {
    this.form = await this.makeForm();
    this.checkEditAction();
  }

  ngAfterViewInit(): void {}

  handleSubmit(data: any): void {
    console.log(data);
    this.dialogData.action === 'Add' ? this.add(data) : this.edit(data);
  }

  add(dataSubmit: any): void {
    var formData= this.form.value;
    var data = {
      name: formData.name,
      // categoryId: formData.categoryId,
      // price: formData.price,
      // description: formData.description
    }

    this._categoryService.add(data).subscribe({
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
        this.onAddCategory.emit();
      }
    });
  }

  edit(dataSubmit: any): void {
    var formData= this.form.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      // categoryId: formData.categoryId,
      // price: formData.price,
      // description: formData.description
    }

    this._categoryService.update(data).subscribe({
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
        this.onEditCategory.emit();
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
      // categoryId: [null, Validators.required],
      // price: [null, Validators.required],
      // description: [null, Validators.required]
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
