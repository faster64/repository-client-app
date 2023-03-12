import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// import {MatDividerModule} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AwsButton } from './aws-button.component';

@NgModule({
  declarations: [AwsButton],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  exports: [
    AwsButton
  ]
})
export class AwsButtonModule { }
