import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage: any;
	data: any;

	constructor(
		private _dashboardService: DashboardService,
		private _ngxService: NgxUiLoaderService,
		private _snackbarService: SnackbarService
	) {
		this._ngxService.start();
		// this.dashboardData();
	}

	ngAfterViewInit(): void { }

	dashboardData(): void {
		this._ngxService.start();
		this._dashboardService.getDetails().subscribe({
			next: (res) => {
				console.log(res)
			},
			error: (err) => {
				this._ngxService.stop();
			},
			complete: () => {
				this._ngxService.stop();
			}
		})
	}
}
