import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AwsButton } from 'src/app/shared/components/aws-button/aws-button.component';
import { MessageBox } from 'src/app/shared/components/aws-message-box/message-box.component';
import { BaseComponent } from 'src/app/shared/components/base-component';
import { CommonRedirect, Routing } from 'src/app/shared/constants/common.constant';
import { Message } from 'src/app/shared/models/message';
import { BaseService } from 'src/app/shared/services/base/base.service';
import { RegisterStep } from '../../shared/enumerations/register-step.enum';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CreateAccountRequest } from './base-step/base-register-step.component';

@Component({
  selector: 'app-register-v2',
  templateUrl: './register-v2.component.html',
  styleUrls: ['./register-v2.component.scss']
})
export class RegisterV2Component extends BaseComponent {

  RegisterStep = RegisterStep;

  Routing = Routing;

  commonRedirect = CommonRedirect;

  currentStep = RegisterStep.RequiredInformation;

  currentInfo = new CreateAccountRequest();

  @ViewChild("nextBtn") nextBtn!: AwsButton;

  constructor(
    baseService: BaseService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  initData(): void {
    this.currentStep = this.activatedRoute.snapshot.data["step"];
  }

  next() {
    this.authenticationService.register(this.currentInfo).subscribe(
      response => {
        this.nextBtn.isFinished = true;
        if (response.success) {
          if (!response.step.isCompleted) {
            if (response.step.currentStep == RegisterStep.VerifiedWithoutPassword) {
              MessageBox.information(new Message(null, { content: 'Có vẻ như bạn đã tạo tài khoản với địa chỉ email này trước đây nhưng chưa tạo mật khẩu. Chúng tôi đã gửi một mật khẩu mặc định về địa chỉ email của bạn. Kiểm tra thư và sử dụng mật khẩu mặc định để đăng nhập.' })).subscribe(() => {
                this.router.navigate([`/${Routing.LOGIN.path}`]);
              });
              return;
            }

            this.currentStep = response.step.currentStep;
            this.router.navigateByUrl(`/${Routing.REGISTER.path}/step${this.currentStep}?refId=${response.step.refId}`);
          } else {
            this.router.navigate([`/${Routing.REGISTER.path}/completed`]);
          }
        }
      },
      error => this.nextBtn.isFinished = true
    )
  }
}
