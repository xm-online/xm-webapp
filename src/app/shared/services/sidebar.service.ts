import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ADMIN_MENU_ITEMS, IAdminMenuItem } from '../../layouts/sidebar/sidebar.constants';

@Injectable()
export class SidebarService {
    public adminMenuItems$: Observable<IAdminMenuItem[]>;
    public _adminMenuItems: BehaviorSubject<IAdminMenuItem[]>;

    constructor() {
        this._adminMenuItems = new BehaviorSubject<IAdminMenuItem[]>(ADMIN_MENU_ITEMS);
        this.adminMenuItems$ = this._adminMenuItems.asObservable();
    }

    public addItem(menuItem: IAdminMenuItem): void {
        const adminMenuItems = this._adminMenuItems.getValue();
        adminMenuItems.push(menuItem);
        this._adminMenuItems.next(adminMenuItems);
    }
}
