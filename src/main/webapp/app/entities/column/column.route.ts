import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ColumnComponent } from './column.component';
import { ColumnDetailComponent } from './column-detail.component';
import { ColumnPopupComponent } from './column-dialog.component';
import { ColumnDeletePopupComponent } from './column-delete-dialog.component';

@Injectable()
export class ColumnResolvePagingParams implements Resolve<any> {

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

export const columnRoute: Routes = [
    {
        path: 'column',
        component: ColumnComponent,
        resolve: {
            'pagingParams': ColumnResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Columns'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'column/:id',
        component: ColumnDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Columns'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const columnPopupRoute: Routes = [
    {
        path: 'column-new',
        component: ColumnPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Columns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'column/:id/edit',
        component: ColumnPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Columns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'column/:id/delete',
        component: ColumnDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Columns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
