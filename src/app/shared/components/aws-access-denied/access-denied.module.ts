import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessDeniedRoutingModule } from './access-denied-routing.module';
import { AccessDeniedComponent } from './access-denied.component';
import { AwsButtonModule } from '../aws-button/aws-button.module';


@NgModule({
  declarations: [AccessDeniedComponent],
  imports: [
    CommonModule,
    AccessDeniedRoutingModule,
    AwsButtonModule
  ],
  exports: [AccessDeniedComponent]
})
export class AccessDeniedModule { }
