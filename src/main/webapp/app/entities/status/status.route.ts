import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { StatusComponent } from './status.component';
import { StatusDetailComponent } from './status-detail.component';
import { StatusPopupComponent } from './status-dialog.component';
import { StatusDeletePopupComponent } from './status-delete-dialog.component';

@Injectable()
export class StatusResolvePagingParams implements Resolve<any> {

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

export const statusRoute: Routes = [
    {
        path: 'status',
        component: StatusComponent,
        resolve: {
            'pagingParams': StatusResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'status/:id',
        component: StatusDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const statusPopupRoute: Routes = [
    {
        path: 'status-new',
        component: StatusPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'status/:id/edit',
        component: StatusPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'status/:id/delete',
        component: StatusDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
