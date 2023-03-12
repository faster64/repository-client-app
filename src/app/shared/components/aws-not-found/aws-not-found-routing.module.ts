import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwsNotFound } from './aws-not-found.component';

const routes: Routes = [
  {
    path: "",
    component: AwsNotFound
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AwsNotFoundRoutingModule { }
