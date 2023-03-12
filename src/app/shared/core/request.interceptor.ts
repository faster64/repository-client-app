import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { LoginStatus } from 'src/app/authentication/shared/enumerations/login.enum';
import { RefreshTokenModel } from 'src/app/authentication/shared/models/requests/refresh-token-model';
import { AuthenticationResponse } from 'src/app/authentication/shared/models/responses/authentication-response';
import { AuthenticationService } from 'src/app/authentication/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { MessageBox } from '../components/aws-message-box/message-box.component';
import { SnackBar } from '../components/aws-snackbar/snackbar.component';
import { CommonConstant, ErrorMessageConstant, PerrmisionConstant, Routing } from '../constants/common.constant';
import { CookieKey } from '../constants/cookie.key';
import { HttpStatusCodeExtension } from '../enumerations/http-status-code-extensions.enum';
import { CookieHelper } from '../helpers/cookie.hepler';
import { StringHelper } from '../helpers/string.helper';
import { BaseMessageResponse } from '../models/base/base-message-response';
import { Message } from '../models/message';
import { SnackBarParameter } from '../models/snackbar.param';
import { HttpCancelService } from './http-cancel.service';


@Injectable()
export class RequestHandlingInterceptor implements HttpInterceptor {

  withoutTokens: string[] = [];

  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private takeInfomationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private preUrl = "";

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private httpCancelService: HttpCancelService
  ) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     if (this.preUrl != event.url && (this.preUrl !== '' && this.preUrl !== '/login')) {
    //       console.log("cancel preUrl:", `-${this.preUrl}-`);
    //       console.log("cancel event:", `-${event.url}-`);
    //       this.httpCancelService.cancelPendingRequests();
    //     }
    //     this.preUrl = event.url;
    //   }
    // });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.injectToken(request);

    return next.handle(request).pipe(
      // takeUntil(this.httpCancelService.onCancelPendingRequests()),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            return this.handleUnauthorized(request, next);

          case HttpStatusCodeExtension.MissingClientInfo:
            return this.handle901(request, next);

          case HttpStatusCode.Forbidden:
            SnackBar.openSnackBarDanger(new SnackBarParameter(null, PerrmisionConstant.NOT_PERMISSION, ''));
            break;

          case HttpStatusCode.ServiceUnavailable:
            MessageBox.information(new Message(this, { content: "Dịch vụ này hiện đang bảo trì. Vui lòng thử lại sau ít phút" }));
            break;

          case HttpStatusCode.TooManyRequests:
            MessageBox.information(new Message(this, { content: "SPAM DETECTED!" }));
            break;

          default:
            if (!environment.enableShowError) {
              MessageBox.information(new Message(this, { content: ErrorMessageConstant.HAS_ERROR_MESSAGE }));
              break;
            }
            MessageBox.information(new Message(this, { content: `${error.message}` }));
            break;
        }
        return throwError(error.error);
      }),
      switchMap(response => {
        if (response.type != 0) {
          this.preNextRequest(response);
        }
        return of(response);
      })
    );
  }

  handle901(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authenticationService.takingInfo) {
      return this.takeInfomationSubject.pipe(
        filter(v => v != null),
        take(1),
        switchMap(() => {
          return next.handle(this.injectToken(request)).pipe(
            // xử lý case 901 xong thì 401
            catchError((error: HttpErrorResponse) => {
              if (error.status === HttpStatusCode.Unauthorized) {
                return this.handleUnauthorized(request, next);
              }
              return throwError(error.error);
            })
          );
        })
      );
    }
    this.authenticationService.takingInfo = true;
    return this.authenticationService.getIpInformation().pipe(
      switchMap(response => {
        this.authenticationService.takingInfo = false;
        this.authenticationService.ipInformation = response;
        this.authenticationService.saveIpInformation(JSON.stringify(response));
        this.takeInfomationSubject.next(response);

        return next.handle(this.injectToken(request));
      }),
      catchError((error: HttpErrorResponse) => {
        this.authenticationService.takingInfo = false;

        // xử lý case 901 xong thì 401
        if (error.status === HttpStatusCode.Unauthorized) {
          return this.handleUnauthorized(request, next);
        }
        return throwError(error.error);
      })
    )
  }

  /**
   * Xử lý khi unauthorized
   */
  handleUnauthorized(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1 vài request ko refresh token
    if (request.url.includes("logout")) {
      return throwError("");
    }

    // Nếu đang refresh thì request khác đợi
    if (this.authenticationService.refreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => {
          return next.handle(this.injectToken(request));
        })
      );
    }

    this.authenticationService.refreshing = true;
    return this.refreshToken().pipe(
      switchMap(response => {
        this.authenticationService.refreshing = false;
        // success thì tiếp tục request
        if (response.code == HttpStatusCode.Ok) {
          CookieHelper.setCookie(`${environment.team}_${CookieKey.LOGGED_IN}`, '1', this.authenticationService.cookieExprie);
          this.authenticationService.saveAuthConfig(response);
          this.refreshTokenSubject.next(response.accessToken);

        } else {
          this.onInvalidRefreshToken();
          return throwError("");
        }

        return next.handle(this.injectToken(request));
      }),
      catchError((e: HttpErrorResponse) => {
        this.authenticationService.refreshing = false;
        return throwError(e.error);
      })
    )

  }

  /**
   * Inject token vào request
   */
  injectToken(request: HttpRequest<unknown>) {
    if (this.withoutTokens.includes(request.url))
      return request;

    return request.clone({
      setHeaders: {
        // 'Content-Type': 'application/json; charset=utf-8',
        // 'Accept': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`,
        'X-Amabon-Client': this.authenticationService.ipInformation ? JSON.stringify(this.authenticationService.ipInformation) : "",
      },
    });
  }

  refreshToken() {
    const refresh = new RefreshTokenModel();
    refresh.userId = this.authenticationService.getUserId() || CommonConstant.ZERO_GUID;
    refresh.refreshToken = this.authenticationService.getRefreshToken();

    return this.authenticationService.refreshToken(refresh);
  }

  onInvalidRefreshToken() {
    const currentStatus = this.authenticationService.getLoginStatus();
    this.authenticationService.logout((response: AuthenticationResponse) => {
      if (currentStatus === LoginStatus.LoggedIn) {
        SnackBar.openSnackBarDanger(new SnackBarParameter(null, PerrmisionConstant.SESSION_EXPRIED, '', 2000));
      }
      return this.router.navigateByUrl(`/${Routing.LOGIN.path}`);
    });
  }

  preNextRequest(response: HttpEvent<unknown>) {
    try {
      response = response as HttpResponse<unknown>;
      const result = response.body as BaseMessageResponse;
      if (result && result.success == false) {
        const mark = this.getMark(response.url || '');

        if (mark.allowNotify) {
          if (!StringHelper.isNullOrEmpty(result.message)) {
            if (mark.notifyType == NotifyType.SnackBar) {
              if (mark.snackBarType == SnackBarType.Danger)
                SnackBar.openSnackBarDanger(new SnackBarParameter(this, result.message));
              else if (mark.snackBarType == SnackBarType.Warning)
                SnackBar.openSnackBarWarning(new SnackBarParameter(this, result.message));

            } else if (mark.notifyType == NotifyType.MessageBox) {
              MessageBox.information(new Message(this, { content: result.message }));
            }

          } else {
            if (mark.notifyType == NotifyType.SnackBar) {
              if (mark.snackBarType == SnackBarType.Danger)
              SnackBar.openSnackBarDanger(new SnackBarParameter(this, ErrorMessageConstant.HAS_ERROR_MESSAGE));
              else if (mark.snackBarType == SnackBarType.Warning)
              SnackBar.openSnackBarDanger(new SnackBarParameter(this, ErrorMessageConstant.HAS_ERROR_MESSAGE));

            } else if (mark.notifyType == NotifyType.MessageBox) {
              MessageBox.information(new Message(this, { content: ErrorMessageConstant.HAS_ERROR_MESSAGE }));
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * _mark:
   * [1]: notify (1: YES, 2: NO)
   * [2]: type (1: Snackbar, 2: MessageBox)
   */
  getMark(url: string): Mark {
    const markKey = CommonConstant.MARK_KEY;
    const markIndex = url.search(markKey);
    const defaultResult = new Mark();

    if (markIndex === -1) {
      return defaultResult;
    } else {
      const mark = url.substring(markIndex);
      const markKeyLength = markKey.length;
      const result = defaultResult;

      if (mark.length === markKeyLength) return result;
      if (mark.length >= markKeyLength + 1) {
        result["allowNotify"] = mark[markKeyLength] == "1" ? true : false;
      }
      if (mark.length >= markKeyLength + 2) {
        result["notifyType"] = parseInt(mark[markKeyLength + 1]);
      }

      return result;
    }
  }
}

class Mark {
  public allowNotify = true;
  public notifyType = NotifyType.SnackBar;
  public snackBarType = SnackBarType.Danger;
}

enum NotifyType {
  SnackBar = 1,
  MessageBox = 2,
}

enum SnackBarType {
  Danger = 1,
  Warning = 2,
}
