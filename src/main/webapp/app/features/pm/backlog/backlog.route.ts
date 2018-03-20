import { BacklogComponent } from './backlog.component';
import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';

export const BacklogRoute: Route = {
    path: 'backlog',
    component: BacklogComponent,
    data: {
        pageTitle: 'Project Management'
    },
    canActivate: [UserRouteAccessService],
};
