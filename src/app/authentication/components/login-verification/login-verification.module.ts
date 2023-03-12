import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginVerificationRoutingModule } from './login-verification-routing.module';
import { LoginVerificationComponent } from './login-verification.component';
import { AwsOtpBoxModule } from 'src/app/shared/components/aws-otp-box/aws-otp-box.module';


@NgModule({
  declarations: [LoginVerificationComponent],
  imports: [
    CommonModule,
    LoginVerificationRoutingModule,
    AwsOtpBoxModule,
  ],
  exports: [LoginVerificationComponent],
})
export class LoginVerificationModule { }
