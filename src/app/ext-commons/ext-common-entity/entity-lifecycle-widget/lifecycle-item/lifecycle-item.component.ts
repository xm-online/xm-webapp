import { Component, Input, OnInit } from '@angular/core';
import { ILifecycleItem } from '../entity-lifecycle-widget.model';

@Component({
  selector: 'xm-lifecycle-item',
  templateUrl: './lifecycle-item.component.html',
  styleUrls: ['./lifecycle-item.component.scss'],
})
export class LifecycleItemComponent implements OnInit {

    @Input() public item: ILifecycleItem;

  constructor() { }

  ngOnInit() {
  }

}
