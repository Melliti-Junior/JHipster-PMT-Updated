import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { SprintCustomComponent } from './sprint-custom.component';
import { SprintCustomDetailComponent } from './sprint-custom-detail.component';
import { SprintCustomPopupComponent } from './sprint-custom-dialog.component';
import { SprintCustomDeletePopupComponent } from './sprint-custom-delete-dialog.component';
import {SprintCustomStartPopupComponent} from './sprint-custom-start-dialog.component';
import {SprintCustomCompletePopupComponent} from './sprint-custom-complete-dialog.component';

@Injectable()
export class SprintCustomResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const sprintcustomRoute: Routes = [
    {
        path: 'sprintcustoms',
        component: SprintCustomComponent,
        resolve: {
            'pagingParams': SprintCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SprintCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sprintcustoms/:id',
        component: SprintCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SprintCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sprintcustomPopupRoute: Routes = [
    {
        path: 'sprintcustom-new',
        component: SprintCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SprintCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sprintcustoms/:id/edit',
        component: SprintCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sprints'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sprintcustoms/:id/delete',
        component: SprintCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SprintCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sprintcustoms/:id/start',
        component: SprintCustomStartPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SprintCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sprintcustoms/:id/complete',
        component: SprintCustomCompletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SprintCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];
