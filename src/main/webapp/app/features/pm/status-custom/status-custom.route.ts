import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { StatusCustomComponent } from './status-custom.component';
import { StatusCustomDetailComponent } from './status-custom-detail.component';
import { StatusCustomPopupComponent } from './status-custom-dialog.component';
import { StatusCustomDeletePopupComponent } from './status-custom-delete-dialog.component';
import {UserRouteAccessService} from '../../../shared';

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

export const statusCustomRoute: Routes = [
    {
        path: 'statuscustoms',
        component: StatusCustomComponent,
        resolve: {
            'pagingParams': StatusResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'statuscustoms/:id',
        component: StatusCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const statusPopupRoute: Routes = [
    {
        path: 'statuscustom-new',
        component: StatusCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'statuscustoms/:id/edit',
        component: StatusCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'statuscustoms/:id/delete',
        component: StatusCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Statuses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
