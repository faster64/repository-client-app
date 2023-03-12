import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AwsButtonModule } from '../aws-button/aws-button.module';
import { AwsLoadingModule } from '../aws-loading/aws-loading.module';
import { AwsHeaderComponent } from './aws-header.component';

@NgModule({
  declarations: [AwsHeaderComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    AwsButtonModule,
    AwsLoadingModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  exports: [AwsHeaderComponent]
})
export class AwsHeaderModule { }
