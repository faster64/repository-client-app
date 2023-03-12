import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonColor, ButtonType, IconButtonType } from '../../constants/button.constant';
import { PerrmisionConstant } from '../../constants/common.constant';
import { ActionPermission } from '../../enumerations/permission.enum';
import { UserHelper } from '../../helpers/user.helper';
import { SnackBarParameter } from '../../models/snackbar.param';
import { SnackBar } from '../aws-snackbar/snackbar.component';

@Component({
  selector: 'aws-button',
  templateUrl: './aws-button.component.html',
  styleUrls: ['./aws-button.component.scss']
})
export class AwsButton implements OnInit, AfterViewInit, OnDestroy {
  IconButtonType = IconButtonType;

  ButtonType = ButtonType;

  private _isFinished = true;
  get isFinished(): boolean {
    return this._isFinished;
  }

  set isFinished(value: boolean) {
    this._isFinished = value;
    this.disabled = !value;
  }

  //#region Input
  @Input()
  buttonType: ButtonType = ButtonType.RAISED;

  @Input()
  actionPermissions: ActionPermission[] = [ActionPermission.None];

  @Input()
  color: ButtonColor = ButtonColor.PRIMARY;

  @Input()
  disabled = false;

  private _text = "Please set button's text";
  @Input()
  get text(): string {
    return this._text;
  }

  set text(value: string) {
    if (value.isNullOrEmpty()) {
      throw Error("value cannot be null or empty");
    }
    this._text = value;
  }

  @Input()
  class = "";

  @Input()
  style = {};

  @Input()
  draggable = false;

  @Input()
  autofocus = false;

  @Input()
  name = "";

  @Input()
  value: any;

  @Input()
  hidden = false;

  @Input()
  width = 0;

  @Input()
  height = 0;

  @Input()
  iconButtonType: IconButtonType = IconButtonType.NONE;

  @Input()
  finishImmediately = false;

  //#endregion

  //#region Output
  @Output()
  onClick = new EventEmitter<any>();

  @Output()
  onDblclick = new EventEmitter<any>();
  //#endregion

  @ViewChild("baseBtn")
  btn!: ElementRef;

  userPermission = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setSize();
  }

  ngOnDestroy(): void {
    this.isFinished = true;
  }

  getButtonWidth() {
    return this.btn.nativeElement.offsetWidth;
  }

  setSize() {
    if (this.width !== 0) {
      this.btn.nativeElement.style.width = this.width + "px";
    }

    if (this.height !== 0) {
      this.btn.nativeElement.style.height = this.height + "px";
    }
  }

  /**
   * Execute when click button
   */
  clickExecute(e: any) {
    if (!this.isFinished)
      return;

    const hasPermission = this.checkPermission();
    if (hasPermission) {
      this.isFinished = false;
      this.onClick.emit(e);

      if (this.finishImmediately) {
        this.isFinished = true;
      }
    } else {
      this.notPermissionNotify();
    }
  }

  /**
   * Execute when dblclick button
   */
  dlclickExecute(e: any) {
    if (!this.isFinished)
      return;

    const hasPermission = this.checkPermission();
    if (hasPermission) {
      this.isFinished = false;
      this.onDblclick.emit(e);

      if (this.finishImmediately) {
        this.isFinished = true;
      }
    } else {
      this.notPermissionNotify();
    }
  }

  /**
   * Check permission
   */
  checkPermission() {
    // Nếu không yêu cầu permission
    if (this.actionPermissions.find(p => p === ActionPermission.None))
      return true;

    // Lấy quyền người dùng
    if (this.userPermission === 0)
      this.userPermission = UserHelper.USER_PERMISSION;

    if (this.userPermission === ActionPermission.All)
      return true;

    return this.actionPermissions.find(p => (this.userPermission & p) !== p) == null;
  }

  /**
   * Bắn noti khi không có quyền
   */
  notPermissionNotify() {
    const snackBarParameter = new SnackBarParameter();
    snackBarParameter.message = PerrmisionConstant.NOT_PERMISSION;
    snackBarParameter.actionText = PerrmisionConstant.OK;
    snackBarParameter.duration = 2000;

    SnackBar.openSnackBarWarning(snackBarParameter);
  }
}
