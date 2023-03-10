import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DxCheckBoxComponent } from 'devextreme-angular';
import { GroupBoxFieldType } from '../../enumerations/common.enum';
import { ColumnGrid } from '../../models/base/column-grid.model';
import { SortModel } from '../../models/base/pagination-request';
import { BaseService } from '../../services/base/base.service';
import { Utility } from '../../utility/utility';
import { BaseGridComponent } from '../base-grid-component';

@Component({
  selector: 'aws-grid',
  templateUrl: './aws-grid.component.html',
  styleUrls: ['./aws-grid.component.scss'],
})
export class AwsGridComponent extends BaseGridComponent implements OnChanges, OnDestroy {
  GroupBoxFieldType = GroupBoxFieldType;

  Utility = Utility;

  @Input()
  displayColumn: ColumnGrid[] = [];

  @Input()
  data: any[] = [];

  @Input()
  current = 0;

  @Input()
  total = 0;

  @Input()
  scrollPosition = 1;

  @Input()
  enableEmitScroll = true;

  @Input()
  enabledCheck = true;

  @Input()
  enabledEdit = false;

  @Input()
  enabledPagination = true;

  @Input()
  autoAdjust = true;

  @Output()
  detectScrollToAnPosition = new EventEmitter();

  @Output()
  checkedEvent = new EventEmitter();

  @Output()
  sort = new EventEmitter();

  @ViewChild('gridContentBody')
  gridContentBody!: ElementRef;

  @ViewChild('table')
  table!: ElementRef;

  @ViewChild("checkAll")
  checkAllInstance!: DxCheckBoxComponent;

  private lastScrollValue = 0;
  private scrollTimer: any;

  checkedList: boolean[] = Array(10000).fill(false);

  numberOfRows = 0;

  offset = 0;

  timer: any;

  sortAscendingValue: SortValue[] = [];

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const currentScrollValue = event.target.offsetHeight + event.target.scrollTop;
    const gridValue = event.target.scrollHeight;

    if (currentScrollValue >= gridValue - this.scrollPosition) {
      if (
        this.enableEmitScroll &&
        this.lastScrollValue <= currentScrollValue
      ) {
        this.detectScrollToAnPosition.emit(currentScrollValue);
      }
    }
    this.lastScrollValue = currentScrollValue;
  }

  constructor(
    baseService: BaseService,
    public cdr: ChangeDetectorRef
  ) {
    super(baseService);
  }

  ngOnInit() {
    super.ngOnInit();
    for (let i = 0; i <= 100; i++) {
      this.sortAscendingValue[i] = new SortValue();
    }
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.calculateNumberOfRows();
    window.addEventListener('resize', () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.adjustGrid();
      }, 50);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"]) {
      setTimeout(() => {
        this.adjustGrid();
      }, 1);
    }
  }

  ngOnDestroy(): void {

  }

  calculateNumberOfRows() {
    setTimeout(() => {
      this.numberOfRows = Math.floor(
        (this.gridContentBody.nativeElement.offsetHeight - 20) / 36
      );
      if (this.numberOfRows < 0) {
        this.numberOfRows = 0;
      }

      this.adjustGrid();
    }, 10);
  }

  setWidth(column: ColumnGrid) {
    if (!column.width || column.width < 0) {
      return {
        width: 'calc(100% - 40px)',
        minWidth: 'calc(100% - 40px)',
        maxWidth: 'calc(100% - 40px)',
      };
    }

    return {
      width: column.width + 'px',
      minWidth: column.width + 'px',
      maxWidth: column.width + 'px',
    };
  }

  /**
   * T??nh to??n l???i width, n???u ch??a full m??n h??nh set last column d??i ph???n c??n d??
   */
  getOffset() {
    const columns = document.querySelectorAll('.column-header');
    let sumWidth = 0;

    columns.forEach((col) => {
      sumWidth += (col as HTMLElement).offsetWidth;
    });

    const offsetRemain = window.innerWidth - sumWidth - 48;
    if (sumWidth > 0 && offsetRemain > 0) {
      this.offset =
        (columns[columns.length - 1] as HTMLElement).offsetWidth + offsetRemain;
    }
  }

  adjustGrid() {
    if (this.autoAdjust) {
      this.getOffset();
      if (this.offset === 0)
        return;

      const length = this.displayColumn.length;
      if (length > 0) {
        this.displayColumn[length - 1].width = this.offset;
      }
    }
  }

  onRowEdit(item: any) {
    this.onEdit.emit(item);
  }

  onRowClick(item: any) {
    this.rowClick.emit(item);
  }

  onRowDblClick(item: any) {
    this.rowDblClick.emit(item);
  }

  onCheck(e: any, index: number) {
    this.checkedList[index] = e.value;
    if (e.value === false) {
      (this.checkAllInstance as any)["value"] = false;
    } else {
      (this.checkAllInstance as any)["value"] = this.isCheckedAll();
    }
    this.checkedEvent.emit();
  }

  onCheckAll(e: any) {
    setTimeout(() => {
      if ((this.checkAllInstance as any)["value"]) {
        for (let i = 0; i < this.checkedList.length; i++) {
          this.checkedList[i] = true;
        }
      } else {
        for (let i = 0; i < this.checkedList.length; i++) {
          this.checkedList[i] = false;
        }
      }
      this.checkedEvent.emit();
    });
  }

  changeAllCheckBox(value: boolean) {
    if (value) {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.checkedList[i] = true;
      }
    } else {
      for (let i = 0; i < this.checkedList.length; i++) {
        this.checkedList[i] = false;
      }
    }
    (this.checkAllInstance as any)["value"] = value;
    this.checkedEvent.emit();
  }

  isCheckedAll() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.checkedList[i] === false)
        return false;
    }
    return true;
  }

  hasCheckedItem() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.checkedList[i] === true)
        return true;
    }
    return false;
  }

  getCheckedItems() {
    const result = [];
    const length = this.checkedList.length < this.data.length ? this.checkedList.length : this.data.length;
    for (let i = 0; i < length; i++) {
      if (this.checkedList[i]) {
        result.push(this.data[i]);
      }
    }
    return result;
  }

  sortGrid(column: any, index: number) {
    for (let i = 0; i < this.sortAscendingValue.length; i++) {
      if (i !== index) {
        this.sortAscendingValue[i].firstClick = true;
        this.sortAscendingValue[i].sortAscending = true;
      }
    }

    this.sortAscendingValue[index].firstClick = false;
    this.sortAscendingValue[index].sortAscending = !this.sortAscendingValue[index].sortAscending;
    this.paginationRequest.sorts = [new SortModel(column.column, this.sortAscendingValue[index].sortAscending)];
    this.sort.emit(this.paginationRequest);
  }
}

export class SortValue {
  public firstClick = true;
  public sortAscending = true;
}
