import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsUploaderComponent } from './aws-uploader.component';
import { DxFileUploaderModule, DxProgressBarModule } from 'devextreme-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AwsButtonModule } from '../aws-button/aws-button.module';

@NgModule({
  declarations: [AwsUploaderComponent],
  imports: [
    CommonModule,
    DxFileUploaderModule,
    DxProgressBarModule,
    NgxDropzoneModule,
    AwsButtonModule,
  ],
  exports: [AwsUploaderComponent]
})
export class AwsUploaderModule { }
