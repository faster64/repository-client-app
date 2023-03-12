import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStatus } from 'src/app/authentication/shared/enumerations/login.enum';
import { AuthenticationService } from 'src/app/authentication/shared/services/authentication.service';
import { CommonRedirect, Routing } from '../../constants/common.constant';

@Component({
  selector: 'access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  back(e: any) {
    if (this.authenticationService.getLoginStatus() === LoginStatus.LoggedIn) {
      this.router.navigate([`/${CommonRedirect}`]);
    } else {
      this.router.navigate([`/${Routing.LOGIN.path}`]);
    }
  }
}
