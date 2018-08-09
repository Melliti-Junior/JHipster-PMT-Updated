import {ProjectManagementComponent} from './project-management.component';
import {Route} from '@angular/router';

import {UserRouteAccessService} from '../../shared';

export const ProjectManagementRoute: Route = {
    path: 'project-management',
    component: ProjectManagementComponent,
    data: {
        pageTitle: 'Project Management'
    },
    canActivate: [UserRouteAccessService],
};
