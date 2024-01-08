import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MenuCategory} from './menu.interface';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({providedIn: 'root'})
export class MenuService {
    private _sidenav: MatSidenav;
    private _menuCategories: BehaviorSubject<MenuCategory[]> = new BehaviorSubject<MenuCategory[]>([]);



    public get sidenav(): MatSidenav {
        return this._sidenav;
    }

    public set sidenav(sidenav: MatSidenav) {
        this._sidenav = sidenav;
    }

    public get menuCategories(): Observable<MenuCategory[]> {
        return this._menuCategories.asObservable();
    }

    public setMenuCategories(menuCategories: MenuCategory[]): void {
        this._menuCategories.next(menuCategories);
    }
}
