import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { IssueCustomComponent } from './issue-custom.component';
import { IssueCustomDetailComponent } from './issue-custom-detail.component';
import { IssueCustomPopupComponent } from './issue-custom-dialog.component';
import { IssueCustomDeletePopupComponent } from './issue-custom-delete-dialog.component';
import {IssueCustomResolvePopupComponent} from "./issue-custom-resolve-dialog.component";

@Injectable()
export class IssueCustomResolvePagingParams implements Resolve<any> {

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

export const issuecustomRoute: Routes = [
    {
        path: 'issuecustoms',
        component: IssueCustomComponent,
        resolve: {
            'pagingParams': IssueCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'issuecustoms/:id',
        component: IssueCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const issuecustomPopupRoute: Routes = [
    {
        path: 'issuecustom-new',
        component: IssueCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issuecustoms/:id/edit',
        component: IssueCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Issues'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issuecustoms/:id/delete',
        component: IssueCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'issuecustoms/:id/resolve',
        component: IssueCustomResolvePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'IssueCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
