import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsGridComponent } from './aws-grid.component';
import { SharedModule } from '../../shared.module';
import { DxCheckBoxModule } from 'devextreme-angular';
import { AwsLoadingModule } from '../aws-loading/aws-loading.module';

@NgModule({
  declarations: [AwsGridComponent],
  imports: [
    CommonModule,
    SharedModule,
    AwsLoadingModule,
    DxCheckBoxModule,
  ],
  exports: [AwsGridComponent]
})
export class AwsGridModule { }
