import { Route } from '@angular/router';
import { HelpComponent } from './help.component';

export const helpRoute: Route = {
    path: 'help',
    component: HelpComponent,
    data: {
        pageTitle: 'global.menu.account.help',
    },
};
