import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBox } from 'src/app/shared/components/aws-message-box/message-box.component';
import { BaseComponent } from 'src/app/shared/components/base-component';
import { CommonRedirect, Routing } from 'src/app/shared/constants/common.constant';
import { CookieKey } from 'src/app/shared/constants/cookie.key';
import { CookieHelper } from 'src/app/shared/helpers/cookie.hepler';
import { Message } from 'src/app/shared/models/message';
import { BaseService } from 'src/app/shared/services/base/base.service';
import { TransferDataService } from 'src/app/shared/services/base/transfer-data.service';
import { environment } from 'src/environments/environment';
import { RegisterStep } from '../../shared/enumerations/register-step.enum';
import { VerifyOtpResult } from '../../shared/models/responses/verify-otp-result';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-login-verification',
  templateUrl: './login-verification.component.html',
  styleUrls: ['./login-verification.component.scss']
})
export class LoginVerificationComponent extends BaseComponent {

  endpoint = "verify-login-otp?username=";

  message = new Message(this, null);

  otp = "";

  username = "";

  email = "";

  constructor(
    baseService: BaseService,
    public authenticationService: AuthenticationService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private transfer: TransferDataService,
  ) {
    super(baseService);
  }

  initData(): void {
    try {
      this.username = atob(this.activatedRoute.snapshot.queryParams["u"]);
      this.email = atob(this.activatedRoute.snapshot.queryParams["e"]);
    }
    catch (e) {
      this.router.navigate([`/${Routing.LOGIN.path}`]);
    }
  }

  verify(e: any) {
    this.otp = e.data;
    this.authenticationService.verifyLoginOtp(this.username, this.otp).subscribe(response => {
      e.callback(response);
      if (response.success) {
        if (response.step && response.step.currentStep !== RegisterStep.RequiredInformation) {
          MessageBox.information(new Message(this, { content: 'Tài khoản của bạn cần bổ sung thêm thông tin. Bổ sung ngay?' })).subscribe(() => {
            this.router.navigate([`${Routing.REGISTER.path}/step${response.step.currentStep}`], { queryParams: { refId: response.step.refId } });
          })
        }
        else {
          this.authenticationService.saveAuthConfig(response);
          CookieHelper.setCookie(`${environment.team}_${CookieKey.LOGGED_IN}`, '1', this.authenticationService.cookieExprie);
          this.transfer.initHeader.emit();
          this.router.navigateByUrl(`/${CommonRedirect}`);
        }
      } else {
        MessageBox.information(new Message(null, { content: response.message }));
      }
    })
  }
}
