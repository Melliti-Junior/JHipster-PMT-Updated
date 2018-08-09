import { AgileComponent } from './agile.component';
import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';

export const AgileRoute: Route = {
    path: 'agile',
    component: AgileComponent,
    data: {
        pageTitle: 'Project Management'
    },
    canActivate: [UserRouteAccessService],
};
