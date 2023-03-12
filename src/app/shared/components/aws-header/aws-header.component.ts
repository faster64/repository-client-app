import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DialogPosition, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { LoginStatus } from 'src/app/authentication/shared/enumerations/login.enum';
import { AuthenticationService } from 'src/app/authentication/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { ButtonColor } from '../../constants/button.constant';
import { BreakPoint, Routing } from '../../constants/common.constant';
import { CookieKey } from '../../constants/cookie.key';
import { CookieHelper } from '../../helpers/cookie.hepler';
import { StringHelper } from '../../helpers/string.helper';
import { UserHelper } from '../../helpers/user.helper';
import { BaseService } from '../../services/base/base.service';
import { TransferDataService } from '../../services/base/transfer-data.service';
import { Utility } from '../../utility/utility';
import { AwsButton } from '../aws-button/aws-button.component';
import { BaseComponent } from '../base-component';

interface ModuleHeader {
  moduleName: string;
  path: string;
  iconPosition: string;
  iconCheckedPosition: string;
  hint: string;
}

@Component({
  selector: 'aws-header',
  templateUrl: './aws-header.component.html',
  styleUrls: ['./aws-header.component.scss'],
})
export class AwsHeaderComponent extends BaseComponent implements AfterViewInit {
  ButtonColor = ButtonColor;

  Utility = Utility;

  LoginStatus = LoginStatus;

  @ViewChild("header", { static: true })
  header!: ElementRef;

  @ViewChildren("modules")
  moduleInstances!: QueryList<ElementRef>;

  @ViewChildren("modulesR")
  moduleInstancesR!: QueryList<ElementRef>;

  moduleWidths: number[] = [];

  @ViewChild("logoutBtn")
  logoutBtn!: AwsButton;

  @ViewChild("loginBtn")
  loginBtn!: AwsButton;

  modules: ModuleHeader[] = [];

  currentIndex = 0;

  breakPointIndex = 9999;

  fullName = '';

  avatarUrl = '';

  avatarNameDefault = '';

  timer: any;

  isLoadingModule = false;

  isLoadingAvatar = true;

  loginStatus: LoginStatus = LoginStatus.Unknown;

  constructor(
    baseService: BaseService,
    public router: Router,
    public location: Location,
    public authenticationService: AuthenticationService,
    public transfer: TransferDataService,
    public cdr: ChangeDetectorRef
  ) {
    super(baseService);
  }


  ngOnInit(): void {
    this.checkLoginStatus();
    if (this.loginStatus === LoginStatus.Unknown) {
      this.loginStatus = LoginStatus.UnLoggedIn;
    }

    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.calcToDisplayModules();
    window.addEventListener('resize', () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.calcToDisplayModules();
      }, 100);
    });
  }

  initData() {
    this.setFullName();
    this.intiModules();
    this.findCurrentModule();
    if (this.loginStatus === LoginStatus.LoggedIn) {
      this.getAvatarUrl();
    }
  }

  checkLoginStatus() {
    this.loginStatus = this.authenticationService.getLoginStatus();
  }

  setFullName() {
    const firstName = CookieHelper.getCookie(`${environment.team}_first_name`) || '';
    const lastName = CookieHelper.getCookie(`${environment.team}_last_name`) || '';
    this.fullName = `${firstName} ${lastName}`;
  }

  getAvatarUrl() {
    // this.avatarService.getAvatarUrl().subscribe(
    //   response => {
    //     this.isLoadingAvatar = false;
    //     if (response.success) {
    //       if (StringHelper.isNullOrEmpty(response.data)) {
    //         this.avatarNameDefault = this.getAvatarNameDefault();
    //       } else {
    //         this.avatarUrl = response.data;
    //       }

    //     } else {
    //       this.avatarNameDefault = this.getAvatarNameDefault();
    //     }
    //   },
    //   error => {
    //     this.isLoadingAvatar = false;
    //     this.avatarNameDefault = this.getAvatarNameDefault();
    //   }
    // )
  }

  getAvatarNameDefault() {
    const lastName = CookieHelper.getCookie(`${environment.team}_${CookieKey.LAST_NAME}`);
    if (lastName === null || lastName.length === 0) {
      return "";
    }

    return lastName[0].toUpperCase();
  }

  /**
   * Khởi tạo module
   */
  intiModules() {
    this.defaultModules();
    this.calcToDisplayModules();
    this.findCurrentModule();
  }

  defaultModules() {
    this.modules = [];
    this.modules.push({
      path: Routing.DASHBOARD.path,
      moduleName: Routing.DASHBOARD.name,
      iconPosition: '0 -272px',
      iconCheckedPosition: '0px -288px',
      hint: 'Màn hình tổng quan và biểu đồ',
    });

    if (UserHelper.USER_ROLES.findIndex(role => role == "root" || role == "admin") !== - 1) {
      this.modules.push({
        path: Routing.ADMIN.path,
        moduleName: Routing.ADMIN.name,
        iconPosition: '-288px -289px',
        iconCheckedPosition: '-288px -289px',
        hint: 'Phần quản trị dành cho quản trị viên',
      });
    }
  }

  calcToDisplayModules() {
    if (!this.moduleInstances || this.moduleInstances.length === 0)
      return;

    if (!this.moduleWidths.length)
      this.moduleWidths = (this.moduleInstances as any)["_results"].map((instance: any) => (instance.nativeElement as HTMLElement).offsetWidth);

    const screenWidth = window.innerWidth;
    let sumWidth = 0;

    this.breakPointIndex = 9999;
    for (let index = 0; index < this.moduleWidths.length; index++) {
      const width = this.moduleWidths[index];
      sumWidth += width;
      if (sumWidth + 128 >= screenWidth) {
        this.breakPointIndex = index;
        break;
      }
    }
    this.cdr.detectChanges();
  }

  /**
   * Bay tới phân hệ chỉ định
   */
  routeUrl(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }

  findCurrentModule() {
    const path = this.location.path();

    // tìm chính xác trước, nếu không thấy tìm startsWith
    const pathSplit = path.split('/');
    if (pathSplit.length >= 1) {
      const index = this.modules.findIndex((m) => m.path === pathSplit[1]);
      if (index !== -1) {
        this.currentIndex = index;
        return;
      }
    }

    this.currentIndex =
      this.modules.findIndex((m) => path.startsWith(`/${m.path}`)) || 0;
  }

  logout() {
    this.transfer.listenInProgress.emit(true);
    this.authenticationService.logout(() => {
      this.transfer.listenInProgress.emit(false);
      this.router.navigateByUrl(`/${Routing.LOGIN.path}`);
      this.logoutBtn.isFinished = true;
    });
  }

  goToDashboard() {
    this.router.navigate([`/${Routing.DASHBOARD.path}`]);
  }

  goToLogin() {
    this.router.navigate([`/${Routing.LOGIN.path}`]);
    this.loginBtn.isFinished = true;
  }

  redirect(path: string, index: number) {
    this.currentIndex = index;
    this.router.navigateByUrl(`/${path}`);
  }

  openUpdateAvatarPopup(e: any) {
    // e.preventDefault();

    // const config = new MatDialogConfig();
    // const position: DialogPosition = {};
    // position.top = '50px';

    // const currentScreenWidth = window.innerWidth;
    // let configWidth = '80%';
    // let configHeight = '280px';
    // const maxWidth = '80%';
    // const maxHeight = '80%';

    // if (currentScreenWidth < BreakPoint.SM) {
    //   configWidth = '80%';
    //   configHeight = '160px';
    // } else if (currentScreenWidth >= BreakPoint.SM && currentScreenWidth < BreakPoint.MD) {
    //   configWidth = '400px';
    // } else {
    //   configWidth = '440px';
    // }

    // config.minWidth = configWidth;
    // config.maxWidth = maxWidth;
    // config.minHeight = configHeight;
    // config.maxHeight = maxHeight;
    // config.position = position;

    // const ref = this.avatarService.openUpdateAvatarPopup(config);
    // ref.afterClosed().pipe(takeUntil(this._onDestroySub)).subscribe(() => this.getAvatarUrl());
  }
}
