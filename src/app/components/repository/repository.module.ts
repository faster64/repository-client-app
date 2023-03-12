import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepositoryRoutingModule } from './repository-routing.module';
import { RepositoryComponent } from './repository.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RepositoryComponent],
  imports: [
    CommonModule,
    RepositoryRoutingModule,
    SharedModule,
  ],
  exports: [RepositoryComponent]
})
export class RepositoryModule { }
