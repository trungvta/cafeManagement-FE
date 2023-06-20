import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  // Show
  isShowing: boolean = false;

  // Subject
  categorysSubject$: Subject<any> = new Subject<any>();
  productsSubject$: Subject<any> = new Subject<any>();
  priceSubject$: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _billService: BillService,
    private _ngxService: NgxUiLoaderService,
    private _snackbarService: SnackbarService
  ) {

    this.categorysSubject$.subscribe((reresponse: any) => {
      console.log(reresponse)
      this.categorys = reresponse;
    });

    this.productsSubject$.subscribe((reresponse: any) => {
      console.log(reresponse)
      this.products = reresponse;
      this.setTheForm('', '', 0);

      console.log(this.manageOrderForm)
    });

    this.priceSubject$.subscribe((reresponse: any) => {
      this.price = reresponse;
      console.log(this.manageOrderForm.controls['quantity'].value)
      this.setTheFormHasProduct(reresponse.price, this.manageOrderForm.controls['quantity'].value, 0);

      console.log(this.manageOrderForm)
    });

  }

  handleShowAction = (): void => {this.isShowing = true;}

  async ngOnInit(): Promise<void> {
    this._ngxService.start();

    this.manageOrderForm = await this.makeForm();
    await this.getCategorys();

    this._ngxService.stop();
    this.handleShowAction();
  }

  ngOnDestroy(): void {
    this.categorysSubject$.complete();
    this.productsSubject$.complete();
    this.priceSubject$.complete();
  }

  setTheForm(price: any, quantity: any, total: any): void {
    this.manageOrderForm.controls['price'].setValue(price);
    this.manageOrderForm.controls['quantity'].setValue(quantity);
    this.manageOrderForm.controls['total'].setValue(total);
  }

  setTheFormHasProduct(price: any, quantity: any, total: any): void {
    if(quantity == '') {
      quantity = 1;
    }
    this.manageOrderForm.controls['price'].setValue(price);
    this.manageOrderForm.controls['quantity'].setValue(quantity);
    this.manageOrderForm.controls['total'].setValue(price * quantity);
  }

  setQuantity(value: any): void {
    console.log(value);
    
    const quantity = this.manageOrderForm.controls['quantity'];
    const price = this.manageOrderForm.controls['price'];
    const total = this.manageOrderForm.controls['total'];

    if(quantity.value > 0) {
      total.setValue(quantity * price);
    }
    else if (quantity.value != '') {
      quantity.setValue('1');
      total.setValue(quantity * price);
    }

    price.setValue(quantity * price);
  }

  validateProductAdd(): any {
    const quantity = this.manageOrderForm.controls['quantity'];
    const total = this.manageOrderForm.controls['total'];

    return (total.value == null || total.value == null || quantity.value <= 0);
  }

  validateSubmit(): any {
    const name = this.manageOrderForm.controls['name'];
    const email = this.manageOrderForm.controls['email'];
    const contactNumber = this.manageOrderForm.controls['contactNumber'];
    const paymentMethod = this.manageOrderForm.controls['paymentMethod'];

    return (name.value == null || email.value == null || contactNumber.value == null || paymentMethod.value == null || !(contactNumber.valid) || !(email.valid));
  }

  add(dataForm: any): void {
    let formData = dataForm.value;
    let productName = this.dataSource.find((e: { id: number }) => e.id == formData.product.id);
    if(productName === undefined) {
      this.totalAmount = this.totalAmount * formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total
      });

      this.dataSource = [...this.dataSource];
      this._snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value: any, element: any): void {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(dataForm: any): void {
    console.log(dataForm)
    let formData = dataForm.value;
    let data = {
      namee: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }

    this._ngxService.start();

    this._billService.generateReport(data).subscribe({
      next: (response: any) => {
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      error: (err) => {
        this._ngxService.stop();
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, 'error');
      },
      complete: () => {
        this._ngxService.stop();
      }
    })
  }

  downloadFile(fileName: any): any {
    let data = {
      uuid: fileName
    };

    this._billService.getPDF(data).subscribe({
      next: (response: any) => {
        saveAs(response, fileName + '.pdf');
      },
      error: (err) => {

      },
      complete: () => {
        this._ngxService.stop();
      }
    })
  }

  getCategorys(): void {
    this._ngxService.start();
    this._categoryService.get().subscribe({
      next: (response: any) => {
        this.categorysSubject$.next(response);
      },
      error: (err) => {
        this._ngxService.stop();
        this.responseMessage = err.error?.message || GlobalConstants.genericError;
        this._snackbarService.openSnackBar(this.responseMessage, 'error');
      },
      complete: () => {
        this._ngxService.stop();
      }
    })
  }

  getProductsByCategory(data: any): void {
    console.log('getProductsByCategory', data)
    this._ngxService.start();

    this._productService.getByCategory(data.id).subscribe({
      next: (response: any) => {
        console.log(response)
        this.productsSubject$.next(response);
      },
      error: (err) => {this._ngxService.stop();},
      complete: () => {this._ngxService.stop();}
    })
  }

  getProductsDetails(data: any): void {
    console.log(data)
    this._ngxService.start();

    this._productService.getById(data.id).subscribe({
      next: (response: any) => {
        this.priceSubject$.next(response);
      },
      error: (err) => {this._ngxService.stop();},
      complete: () => {this._ngxService.stop();}
    })
  }

  makeForm(): FormGroup {
    return this._formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [null, [Validators.required]]
    })
  }

}
