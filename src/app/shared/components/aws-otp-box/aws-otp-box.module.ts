import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from  'ng-otp-input';
import { SharedModule } from 'src/app/shared/shared.module';
import { AwsOtpBoxComponent } from './aws-otp-box.component';
import { AwsButtonModule } from '../aws-button/aws-button.module';

@NgModule({
  declarations: [AwsOtpBoxComponent],
  imports: [
    CommonModule,
    NgOtpInputModule,
    SharedModule,
    AwsButtonModule,
  ],
  exports: [AwsOtpBoxComponent]
})
export class AwsOtpBoxModule { }
