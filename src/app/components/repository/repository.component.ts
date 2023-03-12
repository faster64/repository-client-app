import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/components/base-component';
import { BaseService } from 'src/app/shared/services/base/base.service';
import { FolderService } from 'src/app/shared/services/folder/folder.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent extends BaseComponent {

  folders: any;

  constructor(
    baseService: BaseService,
    public folderService: FolderService,
  ) {
    super(baseService);
  }


  initData(): void {
    this.isLoading = true;
    this.folderService.getAll().pipe(takeUntil(this._onDestroySub)).subscribe(
      response => {
        this.isLoading = false;
        if (response.success) {
          this.folders = response.data;
        }
      },
      error => this.isLoading = false
    );
  }
}
