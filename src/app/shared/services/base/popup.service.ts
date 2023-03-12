import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BreakPoint } from '../../constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  config!: MatDialogConfig;

  constructor(
    public dialog: MatDialog
  ) {

  }

  getBaseConfig() {
    this.config = new MatDialogConfig();
    const position: DialogPosition = {};
    position.top = '50px';

    const currentScreenWidth = window.innerWidth;
    let configWidth = '80%';
    let configHeight = '120px';
    const maxWidth = '80%';
    const maxHeight = '280px';

    if (currentScreenWidth < BreakPoint.SM) {
      configWidth = '80%';
      configHeight = '100px';
    } else if (currentScreenWidth >= BreakPoint.SM && currentScreenWidth < BreakPoint.MD) {
      configWidth = '480px';
    } else {
      configWidth = '440px';
    }

    // this._config.minWidth = '440px';
    this.config.minWidth = configWidth;
    this.config.maxWidth = maxWidth;
    this.config.minHeight = configHeight;
    this.config.maxHeight = maxHeight;
    this.config.position = position;

    return this.config;
  }
}
