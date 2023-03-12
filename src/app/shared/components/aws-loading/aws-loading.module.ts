import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerLoading } from './spinner-loading/spinner-loading.component';
import { SkeletonLoading } from './skeleton-loading/skeleton-loading.component';
import { TextLoadingComponent } from './text-loading/text-loading.component';

@NgModule({
  declarations: [SpinnerLoading, SkeletonLoading, TextLoadingComponent],
  imports: [
    CommonModule,
  ],
  exports: [SpinnerLoading, SkeletonLoading, TextLoadingComponent],
})
export class AwsLoadingModule { }
