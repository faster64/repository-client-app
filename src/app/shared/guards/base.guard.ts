import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginStatus } from 'src/app/authentication/shared/enumerations/login.enum';
import { AuthenticationService } from 'src/app/authentication/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { Routing } from '../constants/common.constant';

@Injectable({
  providedIn: 'root' // you can change to any level if needed
})
export class BaseGuard implements CanActivate {

  constructor(public router: Router, public authenticationService: AuthenticationService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (environment.app_allows_guests || this.authenticationService.getLoginStatus() === LoginStatus.LoggedIn) {
      return true;
    }

    return this.authenticationService.ping().pipe(
      switchMap(response => {
        if (response === "pong")
          return of(true);

        this.router.navigate([`/${Routing.LOGIN.path}`]);
        return of(false);
      })
    )
  }


}
