import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsNotFound } from './aws-not-found.component';
import { AwsButtonModule } from '../aws-button/aws-button.module';
import { AwsNotFoundRoutingModule } from './aws-not-found-routing.module';

@NgModule({
  declarations: [AwsNotFound],
  imports: [
    CommonModule,
    AwsNotFoundRoutingModule,
    AwsButtonModule,
  ],
  exports: [AwsNotFound]
})
export class AwsNotFoundModule { }
