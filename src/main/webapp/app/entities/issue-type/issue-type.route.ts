import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { IssueTypeComponent } from './issue-type.component';
import { IssueTypeDetailComponent } from './issue-type-detail.component';
import { IssueTypePopupComponent } from './issue-type-dialog.component';
import { IssueTypeDeletePopupComponent } from './issue-type-delete-dialog.component';

@Injectable()
export class IssueTypeResolvePagingParams implements Resolve<any> {

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

export const issueTypeRoute: Routes = [
    {
        path: 'issue-type',
        component: IssueTypeComponent,
        resolve: {
            'pagingParams': IssueTypeResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueTypes'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'issue-type/:id',
        component: IssueTypeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueTypes'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const issueTypePopupRoute: Routes = [
    {
        path: 'issue-type-new',
        component: IssueTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueTypes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issue-type/:id/edit',
        component: IssueTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueTypes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issue-type/:id/delete',
        component: IssueTypeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueTypes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
