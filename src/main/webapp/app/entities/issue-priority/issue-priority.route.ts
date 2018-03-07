import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { IssuePriorityComponent } from './issue-priority.component';
import { IssuePriorityDetailComponent } from './issue-priority-detail.component';
import { IssuePriorityPopupComponent } from './issue-priority-dialog.component';
import { IssuePriorityDeletePopupComponent } from './issue-priority-delete-dialog.component';

@Injectable()
export class IssuePriorityResolvePagingParams implements Resolve<any> {

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

export const issuePriorityRoute: Routes = [
    {
        path: 'issue-priority',
        component: IssuePriorityComponent,
        resolve: {
            'pagingParams': IssuePriorityResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssuePriorities'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'issue-priority/:id',
        component: IssuePriorityDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssuePriorities'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const issuePriorityPopupRoute: Routes = [
    {
        path: 'issue-priority-new',
        component: IssuePriorityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssuePriorities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issue-priority/:id/edit',
        component: IssuePriorityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssuePriorities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issue-priority/:id/delete',
        component: IssuePriorityDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssuePriorities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
