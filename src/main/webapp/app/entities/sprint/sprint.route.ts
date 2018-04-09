import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { SprintComponent } from './sprint.component';
import { SprintDetailComponent } from './sprint-detail.component';
import { SprintPopupComponent } from './sprint-dialog.component';
import { SprintDeletePopupComponent } from './sprint-delete-dialog.component';

@Injectable()
export class SprintResolvePagingParams implements Resolve<any> {

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

export const sprintRoute: Routes = [
    {
        path: 'sprint',
        component: SprintComponent,
        resolve: {
            'pagingParams': SprintResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sprints'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sprint/:id',
        component: SprintDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sprints'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sprintPopupRoute: Routes = [
    {
        path: 'sprint-new',
        component: SprintPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sprints'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sprint/:id/edit',
        component: SprintPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sprints'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sprint/:id/delete',
        component: SprintDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sprints'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
