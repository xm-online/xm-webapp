import { Routes } from '@angular/router';
import { HomeComponent } from './';
import { HomeDefaultComponent } from './home-default/home-default.component';

export const HOME_ROUTES: Routes = [{
    path: '',
    component: HomeComponent,
    data: {
        authorities: [],
        pageTitle: 'home.title',
    },
},{
    path: 'home',
    component: HomeDefaultComponent,
    data: {
        authorities: [],
        pageTitle: 'home-default.title',
    },
}];
