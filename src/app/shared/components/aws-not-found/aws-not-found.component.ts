import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonColor, ButtonType, IconButtonType } from '../../constants/button.constant';
import { CommonRedirect, Routing } from '../../constants/common.constant';

@Component({
  selector: 'aws-not-found',
  templateUrl: './aws-not-found.component.html',
  styleUrls: ['./aws-not-found.component.scss']
})
export class AwsNotFound implements OnInit {
  ButtonColor = ButtonColor;

  ButtonType = ButtonType;

  IconButtonType = IconButtonType;
  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.router.navigate([`/${CommonRedirect}`]);
  }

}
