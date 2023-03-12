import { HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AwsButton } from 'src/app/shared/components/aws-button/aws-button.component';
import { SnackBar } from 'src/app/shared/components/aws-snackbar/snackbar.component';
import { BaseComponent } from 'src/app/shared/components/base-component';
import { CommonRedirect, Routing } from 'src/app/shared/constants/common.constant';
import { CookieKey } from 'src/app/shared/constants/cookie.key';
import { CookieHelper } from 'src/app/shared/helpers/cookie.hepler';
import { SnackBarParameter } from 'src/app/shared/models/snackbar.param';
import { BaseService } from 'src/app/shared/services/base/base.service';
import { TransferDataService } from 'src/app/shared/services/base/transfer-data.service';
import { Utility } from 'src/app/shared/utility/utility';
import { environment } from 'src/environments/environment';
import { UserCred } from '../../shared/models/requests/user-cred';
import { AuthenticationResponse } from '../../shared/models/responses/authentication-response';
import { AuthenticationService } from '../../shared/services/authentication.service';

declare var google: any;

declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements AfterViewInit {

  Utility = Utility;

  registerUrl = Routing.REGISTER.path;

  userCred = new UserCred();

  @ViewChild("email") emailInput!: ElementRef;

  @ViewChild("password") passwordInput!: ElementRef;

  @ViewChild("loginBtn") loginBtn!: AwsButton;

  @ViewChild("googleBtn") googleBtn!: ElementRef;

  constructor(
    baseService: BaseService,
    private transfer: TransferDataService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    // private socialAuthService: SocialAuthService
  ) {
    super(baseService);
  }

  initData(): void {
    this.setBackground();
  }

  ngAfterViewInit(): void {
    this.initForm();
    this.cdr.detectChanges();
    // google.accounts.id.initialize({
    //   client_id: "483405168173-ng58air6q83sgnmeo80sc6g0gsm2nmpf.apps.googleusercontent.com",
    //   callback: (response: any) => this.handleGoogleSignIn(response)
    // });
    // google.accounts.id.renderButton(
    //   document.getElementById("googleBtn"),
    //   {
    //     theme: 'outline',
    //     size: 'large',
    //     width: this.googleBtn.nativeElement.offsetWidth,
    //     text: 'Đăng nhập với Google',
    // }  // customization attributes
    // );
  }

  handleGoogleSignIn(response: any) {
    // gapi.load('auth2', function() {
    //   gapi.auth2.init({'client_id': '483405168173-ng58air6q83sgnmeo80sc6g0gsm2nmpf.apps.googleusercontent.com'});
    // });

    // // This next is for decoding the idToken to an object if you want to see the details.
    // let base64Url = response.credential.split('.')[1];
    // let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    //   return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));
  }

  logout() {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * khởi tạo form
   */
  initForm() {
    if (!environment.production) {
      this.userCred.userName = "admin";
      this.userCred.password = "admin12@@";
    }
    this.emailInput.nativeElement.focus();
  }

  /**
   * Thực thi khi có lỗi trong lúc validate
   */
  executeOnError(field: string, message: string): boolean {
    const snackBarParameter = new SnackBarParameter();
    snackBarParameter.duration = SnackBar.forever;
    snackBarParameter.message = message;
    snackBarParameter.afterDismissedCallback = () => this.focusOnFieldError(field);
    SnackBar.openSnackBarDanger(snackBarParameter);

    this.focusOnFieldError(field);
    return false;
  }

  public setBackground() {
    const start = 1;
    const end = 6;
    const val = Math.floor(Math.random() * (end - start + 1) + start);
    const loginElement = document.getElementById("login");
    (loginElement as any).style.backgroundImage = `url(../../../../assets/img/bg${val}.jpg)`;
  }

  /**
   * focus vào field lỗi
   */
  private focusOnFieldError(field: string) {
    if (field.isNullOrEmpty() === false) {
      (this as any)[`${field}Input`].nativeElement.focus();
    }
  }

  /**
   * Validate trước khi tiến hành đăng nhập
   */
  validateBeforeLogin(): boolean {
    if (this.userCred.userName.isNullOrEmpty()) {
      return this.executeOnError("email", "Tài khoản không được để trống");

    } else if (this.userCred.password.isNullOrEmpty()) {
      return this.executeOnError("password", "Mật khẩu không được để trống");
    }

    return true;
  }

  /**
   * Đăng nhập
   */
  login(e: any) {
    if (!this.validateBeforeLogin()) {
      this.loginBtn.isFinished = true;
      return;
    }
    SnackBar.dismiss();

    this.authenticationService.login(this.userCred).subscribe(
      response => {
        this.loginBtn.isFinished = true;
        if (response.code == HttpStatusCode.Ok) {
          this.handleLoggedIn(response);
        }
      },
      () => {
        this.loginBtn.isFinished = true;
      }
    );
  }

  /**
   * Đăng nhập khi ấn enter
   */
  loginByEnter(e: any) {
    if (e.key === "Enter") {
      this.loginBtn.clickExecute(e);
    }
  }

  handleLoggedIn(response: AuthenticationResponse) {
    this.authenticationService.saveAuthConfig(response);
    CookieHelper.setCookie(`${environment.team}_${CookieKey.LOGGED_IN}`, '1', this.authenticationService.cookieExprie);
    this.transfer.initHeader.emit();
    this.router.navigateByUrl(`/${CommonRedirect}`);
  }

  loginWithGoogle(): void {
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
