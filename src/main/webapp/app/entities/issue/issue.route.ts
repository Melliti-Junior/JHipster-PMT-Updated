import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { IssueComponent } from './issue.component';
import { IssueDetailComponent } from './issue-detail.component';
import { IssuePopupComponent } from './issue-dialog.component';
import { IssueDeletePopupComponent } from './issue-delete-dialog.component';

@Injectable()
export class IssueResolvePagingParams implements Resolve<any> {

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

export const issueRoute: Routes = [
    {
        path: 'issue',
        component: IssueComponent,
        resolve: {
            'pagingParams': IssueResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Issues'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'issue/:id',
        component: IssueDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Issues'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const issuePopupRoute: Routes = [
    {
        path: 'issue-new',
        component: IssuePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Issues'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issue/:id/edit',
        component: IssuePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Issues'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issue/:id/delete',
        component: IssueDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Issues'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
