import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from './authentication/shared/services/authentication.service';
import { AwsHeaderComponent } from './shared/components/aws-header/aws-header.component';
import { SnackBar } from './shared/components/aws-snackbar/snackbar.component';
import { Routing } from './shared/constants/common.constant';
import { DeviceType } from './shared/enumerations/device.enum';
import { SettingService } from './shared/services/base/setting.service';
import { SharedService } from './shared/services/base/shared.service';
import { TransferDataService } from './shared/services/base/transfer-data.service';
import { Utility } from './shared/utility/utility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("app", { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  @ViewChild("appContent", { static: true })
  appContent!: ElementRef;

  @ViewChild("header", { static: true })
  header!: AwsHeaderComponent;

  inProgress = false;

  progressValue = 35;

  /**
   * Danh sách các route hiển thị full màn hình
   */
  fullPageRoutes: PageRoute[] = [];

  priodicalId: any;

  _onDestroySub: Subject<void> = new Subject<void>();

  lostConnection = false;

  constructor(
    private transfer: TransferDataService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private cfr: ComponentFactoryResolver,
    private sharedService: SharedService,
  ) {

  }

  ngOnInit() {
    this.detectDevice();
    this.detectInternet();
    this.initData();
    this.eventSubscribe();
  }

  /**
   * Khởi tạo dữ liệu
   */
  initData() {
    this.fullPageRoutes = [
      { path: Routing.NOT_FOUND.path, type: PageRouteType.Equal },
      { path: Routing.ACCESS_DENIED.path, type: PageRouteType.Equal },
      { path: Routing.LOGIN.path, type: PageRouteType.Equal },
      { path: Routing.LOGOUT.path, type: PageRouteType.Equal },
      { path: Routing.REGISTER.path, type: PageRouteType.StartWith },
      { path: Routing.VERIFY_REGISTER.path, type: PageRouteType.StartWith },
      { path: Routing.VERIFY_LOGIN.path, type: PageRouteType.StartWith },
    ];
  }


  eventSubscribe() {
    this.listenProgress();
    this.routerChangeSubscribe();
    this.initHeader()
    // this.listenChangeSizeSidebar();
  }

  listenProgress() {
    this.transfer.listenInProgress.pipe(takeUntil(this._onDestroySub)).subscribe(response => {
      if (response == true) {
        this.inProgress = true;
        this.progressValue = 35;

        const id = setInterval(() => {
          if (this.progressValue >= 90) {
            clearInterval(id);
            return;
          }

          this.progressValue += 1;
        }, 20);

      } else {
        this.inProgress = false;
      }
    })
  }

  listenChangeSizeSidebar() {
    this.transfer.listenChangeSizeSidebar.pipe(takeUntil(this._onDestroySub)).subscribe((response) => {
      this.changeSizeSidebar(response);
    })
  }

  initHeader() {
    this.transfer.initHeader.pipe(takeUntil(this._onDestroySub)).subscribe(() => {
      this.header.ngOnInit();
    });
  }

  /**
   * Handle khi route change
   */
  routerChangeSubscribe() {
    this.router.events.pipe(takeUntil(this._onDestroySub)).subscribe(async (event: any) => {
      if (event instanceof NavigationStart) {
        this.transfer.listenInProgress.emit(true);
      }

      if (event instanceof NavigationEnd) {
        this.transfer.listenInProgress.emit(false);

        let isFullPage = false;
        for (let i = 0; i < this.fullPageRoutes.length; i++) {
          // if (event.url === '/') {
          //   isFullPage = true;
          //   break;
          // }

          const fullPageRoute = this.fullPageRoutes[i];
          if (fullPageRoute.type === PageRouteType.Equal && `/${fullPageRoute.path}` === event.urlAfterRedirects) {
            isFullPage = true;
            break;
          } else if (fullPageRoute.type === PageRouteType.StartWith && event.urlAfterRedirects.startsWith(`/${fullPageRoute.path}`) && event.urlAfterRedirects !== '/') {
            isFullPage = true;
            break;
          } else if (fullPageRoute.type === PageRouteType.EndWith && event.urlAfterRedirects.endsWith(`/${fullPageRoute.path}`) && event.urlAfterRedirects !== '/') {
            isFullPage = true;
            break;
          }
        }

        this.adjustUI(isFullPage);

        if (!isFullPage) {
          this.containerRef.clear();
          // this.bindingHeaderDynamic();
          // this.bindingSidebarDynamic();
        }
      }

      // Cập nhật module ở header
      this.header.findCurrentModule();
    });
  }

  /**
   * Chỉnh sửa lại UI khi vào form login
   * app-content adjust thành full page
   */
  adjustUI(isFullPage: boolean) {
    const htmlElement = this.appContent.nativeElement as HTMLElement;
    const header = this.header.header.nativeElement as HTMLElement;

    if (isFullPage) {
      this.containerRef.clear();
      htmlElement.style.top = "0";
      header.style.height = "0";
      // htmlElement.style.left = "0";
    } else {
      htmlElement.style.top = "92px";
      header.style.height = "92px";
      // htmlElement.style.left = "180px";
    }

  }

  changeSizeSidebar(type: string) {
    const htmlElement = this.appContent.nativeElement as HTMLElement;
    if (type === "collapse") {
      htmlElement.style.left = "0";
    } else {
      htmlElement.style.left = "180px";
    }
  }

  detectDevice() {
    this.sharedService.deviceType = Utility.getDevice();
    console.log("Phát hiện loại thiết bị đang sử dụng: " + (this.sharedService.deviceType === DeviceType.Mobile ? '[MOBILE]' : '[DESKTOP]'));
  }

  detectInternet() {
    fromEvent(window, "offline").subscribe(() => {
      this.lostConnection = true;
      SnackBar.snackBar.open('Bạn đang offline', 'Đồng ý', {
        duration: SnackBar.forever,
        panelClass: ['internet-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
    fromEvent(window, "online").subscribe(() => {
      if (this.lostConnection) {
        this.lostConnection = false;
        SnackBar.snackBar.open('Đã khôi phục kết nối internet', 'Đồng ý', {
          duration: 2000,
          panelClass: ['internet-snackbar', 'success'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  /**
   * Binding header
   */
  // async bindingHeaderDynamic() {
  //   const { HeaderComponent } = await import('src/app/shared/components/header/header.component');
  //   const componentFactory = this.cfr.resolveComponentFactory(HeaderComponent);
  //   const componentRef = this.containerRef.createComponent(componentFactory);
  // }

  ngOnDestroy(): void {
    // unsubscribe khi destroy
    if (this._onDestroySub) {
      this._onDestroySub.next();
      this._onDestroySub.complete();
      this._onDestroySub.unsubscribe();
    }
  }

}


interface PageRoute {
  path: string;
  type: PageRouteType;
}

enum PageRouteType {
  Equal = 1,
  StartWith = 2,
  EndWith = 3,
}
