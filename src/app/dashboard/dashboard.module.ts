import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { MaterialModule } from '../shared/material-module';

import { MatCardModule } from '@angular/material/card';

console.log('DashboardModule');
console.log('DashboardModule 2', DashboardRoutes);


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(DashboardRoutes),

  ],
  declarations: [
    DashboardComponent
]
})
export class DashboardModule { }
