import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { delay } from "rxjs/operators";
import { AuthenticationService } from "src/app/authentication/shared/services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class FirstVisitResolver<T> implements Resolve<T> {

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T | any {
    return of('aws').pipe(delay(300));
  }
}
