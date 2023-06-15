import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

	responseMessage: any;
	data: any;

	constructor(
		private _dashboardService: DashboardService,
		private _ngxService: NgxUiLoaderService,
		private _snackbarService: SnackbarService
	) {
		this._ngxService.start();
		this.dashboardData();
	}

	ngOnInit(): void {
		console.log('DashboardComponent');
	}

	ngAfterViewInit(): void { }
	
	dashboardData(): void {
		this._ngxService.start();
		this._dashboardService.getDetails().subscribe({
			next: (res) => {
				console.log(res);
				this.data = res;
			},
			error: (err) => {
				this._ngxService.stop();
				this.responseMessage = err.error?.message || GlobalConstants.genericError;
				this._snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
			},
			complete: () => {
				this._ngxService.stop();
			}
		})
	}
}
