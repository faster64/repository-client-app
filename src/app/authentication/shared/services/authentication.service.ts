import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonConstant, Routing } from 'src/app/shared/constants/common.constant';
import { CookieKey } from 'src/app/shared/constants/cookie.key';
import { CookieHelper } from 'src/app/shared/helpers/cookie.hepler';
import { StringHelper } from 'src/app/shared/helpers/string.helper';
import { PaginationRequest } from 'src/app/shared/models/base/pagination-request';
import { ServiceResult } from 'src/app/shared/models/base/service-result';
import { HttpService } from 'src/app/shared/services/base/http.service';
import { TransferDataService } from 'src/app/shared/services/base/transfer-data.service';
import { environment } from 'src/environments/environment';
import { BaseMessageResponse } from '../../../shared/models/base/base-message-response';
import { LoginStatus } from '../enumerations/login.enum';
import { MFA } from '../models/mfa-model';
import { RefreshTokenModel } from '../models/requests/refresh-token-model';
import { UserCred } from '../models/requests/user-cred';
import { AuthenticationResponse } from '../models/responses/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private markKey = CommonConstant.MARK_KEY;


  /**
   * auth api url
   */
  public auth_api_url = `${environment.api_url}`;

  public cookieExprie = 7;

  public ipInformation: any;

  /**
   * Thời gian ping check live token
   */
  get PING_TIME() {
    return 300000;
  };

  /**
   * True nếu đang refresh token, otherwise false
   */
  public refreshing = false;

  public takingInfo = false;

  public logoutCallback?: Function;

  constructor(
    public _httpService: HttpService,
    public _transfer: TransferDataService,
    public router: Router,
  ) {

    const info = CookieHelper.getCookie(`${environment.team}_${CookieKey.IP_INFORMATION}`);
    if (info) {
      this.ipInformation = JSON.parse(info);
    } else {
      this.ipInformation = null;
    }
  }

  public getUserId() {
    return CookieHelper.getCookie(`${environment.team}_${CookieKey.USER_ID}`) || "";
  }

  public getAccessToken() {
    return CookieHelper.getCookie(`${environment.team}_${CookieKey.ACCESS_TOKEN}`) || "";
  }

  public getRefreshToken() {
    return CookieHelper.getCookie(`${environment.team}_${CookieKey.REFRESH_TOKEN}`) || "";
  }

  /**
   * Lưu user config
   */
  saveAccessTokenConfig(accessToken: string) {
    const config = StringHelper.parseJwt(accessToken);
    const keys = Object.keys(config);

    CookieHelper.setCookie(`${environment.team}_${CookieKey.ACCESS_TOKEN}`, accessToken, this.cookieExprie);
    keys.forEach(key => {
      let snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (!snakeCaseKey.startsWith('_')) {
        snakeCaseKey = `_${snakeCaseKey}`;
      }
      CookieHelper.setCookie(`${environment.team}${snakeCaseKey}`, config[key], this.cookieExprie);
    });
  }

  /**
   * Lưu config
   */
  saveAuthConfig(config: AuthenticationResponse) {
    this.saveAccessTokenConfig(config.accessToken);
    CookieHelper.setCookie(`${environment.team}_${CookieKey.REFRESH_TOKEN}`, config.refreshToken, this.cookieExprie);
  }

  /**
   * Trả về login status
   */
  getLoginStatus(): LoginStatus {
    const loggedIn = CookieHelper.getCookie(`${environment.team}_${CookieKey.LOGGED_IN}`);
    if (loggedIn === '1') {
      return LoginStatus.LoggedIn;

    } else if (loggedIn === '0') {
      return LoginStatus.UnLoggedIn;
    }
    return LoginStatus.Unknown;
  }

  /**
   * Refresh token
   */
  refreshToken(refresh: RefreshTokenModel) {
    const url = `${this.auth_api_url}/authentication/refresh-token?${this.markKey}0`;
    return this._httpService.post<AuthenticationResponse>(url, refresh);
  }

  getIpInformation() {
    return this._httpService.get(`https://ipinfo.io?token=cd6d6696ae1c97`);
  }

  saveIpInformation(ipinfoText: any) {
    CookieHelper.setCookie(`${environment.team}_${CookieKey.IP_INFORMATION}`, ipinfoText, 1 / 480);
  }

  /**
   * ping check live token
   */
  ping() {
    const url = `${this.auth_api_url}/authentication/ping?uid=${this.getUserId()}&${this.markKey}0`;
    return this._httpService.get<string>(url);
  }

  /**
   * Đăng ký
   */
  register(userInfo: any) {
    const url = `${this.auth_api_url}/authentication/create-account?${this.markKey}12`;
    return this._httpService.post<AuthenticationResponse>(url, userInfo);
  }

  getCurrentInfo(refId: string) {
    const url = `${this.auth_api_url}/authentication/reg/get-current-info?refId=${refId}`;
    return this._httpService.get<ServiceResult>(url);
  }

  resendRegisterOtp(refId: string) {
    const url = `${this.auth_api_url}/authentication/register-otp?refId=${refId}`;
    return this._httpService.get<ServiceResult>(url);
  }

  /**
   * Đăng nhập
   */
  login(userCred: UserCred) {
    const url = `${this.auth_api_url}/authentication/sign-in`;
    return this._httpService.post<AuthenticationResponse>(url, userCred);
  }

  /**
   * Đăng xuất
   */
  logout(callback?: Function) {
    this.logoutCallback = callback;
    this.router.navigate([`/${Routing.LOGOUT.path}`]);
  }

  /**
   * Gửi mã OTP
   */
  verifyLoginOtp(username: string, otp: string) {
    const url = `${this.auth_api_url}/authentication/verify-login-otp?username=${username}&otp=${otp}`;
    return this._httpService.get<AuthenticationResponse>(url);
  }

  /**
   * Cấp mã OTP mới
   * u: UserName
   */
  sendNewOtp(u: string, type: number) {
    const url = `${this.auth_api_url}/authentication/provide-new-otp?u=${btoa(u)}&type=${type}`;
    return this._httpService.get<BaseMessageResponse>(url);
  }

  /**
   * verify with secret key
   */
  verifySecretKey(secretKey: string) {
    const url = `${this.auth_api_url}/authentication/verify-secret-key?secretKey=${btoa(secretKey)}`;
    return this._httpService.get<ServiceResult>(url);
  }

  /**
   * Trả về MFA setting
   */
  getMfaSetting() {
    const url = `${this.auth_api_url}/authentication/mfa-setting`;
    return this._httpService.get<ServiceResult>(url);
  }

  /**
   * set MFA
   */
  setMfa(mfa: MFA) {
    const url = `${this.auth_api_url}/authentication/set-mfa`;
    return this._httpService.post<ServiceResult>(url, mfa);
  }

  /**
   * Lịch sử đăng nhập
   */
  getLoginHistory(pagination: PaginationRequest) {
    const url = `${this.auth_api_url}/loginlog/paging`;
    return this._httpService.post<ServiceResult>(url, pagination);
  }
}
