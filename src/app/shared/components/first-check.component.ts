import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStatus } from 'src/app/authentication/shared/enumerations/login.enum';
import { AuthenticationService } from 'src/app/authentication/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { CommonRedirect, Routing } from '../constants/common.constant';

@Component({
  selector: 'first-check',
  template: '',
  styles: []
})
export class FirstCheckComponent implements OnInit {

  constructor(public router: Router, public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    const status = this.authenticationService.getLoginStatus();
    console.log('first-check', status);

    setTimeout(() => {
      if (environment.app_allows_guests || status === LoginStatus.LoggedIn) {
        this.router.navigate([`/${CommonRedirect}`]);
      } else {
        this.router.navigate([`/${Routing.LOGIN.path}`]);
      }
    }, 10);
  }

}
