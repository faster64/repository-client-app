import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DxFileUploaderModule, DxProgressBarModule } from "devextreme-angular";
import { AwsHeaderModule } from "./components/aws-header/aws-header.module";
import { AwsLoadingModule } from "./components/aws-loading/aws-loading.module";
import { AwsUploaderModule } from "./components/aws-uploader/aws-uploader.module";
import { FirstCheckComponent } from "./components/first-check.component";
import { CountDownPipe } from "./pipes/count-down.pipe";
import { DateVietnamPipe } from "./pipes/date.pipe";
import { NumberFormatPipe } from "./pipes/number-format.pipe";


@NgModule({
  declarations: [
    DateVietnamPipe,
    CountDownPipe,
    NumberFormatPipe,
    FirstCheckComponent,
  ],
  imports: [
    CommonModule,
    AwsLoadingModule,
    AwsUploaderModule,
    AwsHeaderModule,
    MatProgressBarModule,
    MatTooltipModule,
    DxFileUploaderModule,
    DxProgressBarModule,
  ],
  exports: [
    AwsLoadingModule,
    AwsUploaderModule,
    AwsHeaderModule,
    DateVietnamPipe,
    CountDownPipe,
    NumberFormatPipe,
    MatProgressBarModule,
    MatTooltipModule,
    DxFileUploaderModule,
    DxProgressBarModule,
  ]
})
export class SharedModule { }
