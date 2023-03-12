import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'text-loading',
  templateUrl: './text-loading.component.html',
  styleUrls: ['./text-loading.component.scss']
})
export class TextLoadingComponent implements OnInit {

  @Input()
  text = "Loading...";

  constructor() { }

  ngOnInit(): void {
  }

}
