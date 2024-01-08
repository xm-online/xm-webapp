import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {XmTranslationModule} from '@xm-ngx/translation';
import {MenuCategory} from '../menu.interface';
import {MenuService} from '../menu.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'xm-menu-categories',
    templateUrl: './menu-categories.component.html',
    styleUrls: ['./menu-categories.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, MatIconModule, XmTranslationModule],
})
export class MenuCategoriesComponent implements OnInit {
    public categories$: Observable<MenuCategory[]>;

    @Output() public hoverCategoryTrigger: EventEmitter<MenuCategory> = new EventEmitter<MenuCategory>();

    constructor(private menuService: MenuService) {
    }

    public ngOnInit(): void {
        this.setMenuCategories();
    }

    private setMenuCategories(): void {
        this.categories$ = this.menuService.menuCategories;
    }

    public async onHoverCategory(category: MenuCategory): Promise<void> {
        await this.menuService.sidenav.open();
        // this.hoverCategoryTrigger.emit(category);
    }

    public async onLeaveCategory(): Promise<void> {
        await this.menuService.sidenav.close();
    }
}
