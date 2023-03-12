import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxDropzoneComponent } from 'ngx-dropzone';
import { Utility } from '../../utility/utility';
import { AwsButton } from '../aws-button/aws-button.component';

@Component({
  selector: 'aws-uploader',
  templateUrl: './aws-uploader.component.html',
  styleUrls: ['./aws-uploader.component.scss']
})
export class AwsUploaderComponent implements OnInit {

  formData = new FormData();

  maxFileSize = 1024 * 1024 * 50;

  @Input()
  allowedFileExtensions = Utility.videoExtensions.map(i => `.${i}`).concat(Utility.imageExtensions.map(i => `.${i}`)).join(",");

  @Input()
  disabled = false;

  @Input()
  multiple = false;

  @Input()
  uploadUrl = '';

  @Input()
  emitAutomatically = false;

  @Input()
  showUploadButton = true;

  @Input()
  files: File[] = [];

  @Output()
  onUpload = new EventEmitter();

  @ViewChild("uploadBtn")
  uploadBtn!: AwsButton;

  @ViewChild("dropzone")
  dropzone!: NgxDropzoneComponent;


  constructor() { }

  ngOnInit() {
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    if (this.emitAutomatically) {
      this.uploadBtn?.clickExecute(null);
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  upload() {
    this.onUpload.emit(this.files);
  }
}
