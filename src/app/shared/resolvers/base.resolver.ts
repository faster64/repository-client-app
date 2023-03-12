import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { AuthenticationService } from "src/app/authentication/shared/services/authentication.service";
import { Utility } from "../utility/utility";

@Injectable({
  providedIn: 'root'
})
export class BaseResolver<T> implements Resolve<T> {

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T | any {
    Utility.changeTitle(route.data["title"] || "Google");
    // return of('aws').pipe(delay(300));
    return of('aws');
  }
}
