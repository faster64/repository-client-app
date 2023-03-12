import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AwsButtonModule } from 'src/app/shared/components/aws-button/aws-button.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    AwsButtonModule
  ],
  exports: [LoginComponent]
})
export class LoginModule { }
