import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { ColumnCustomComponent } from './column-custom.component';
import { ColumnCustomDetailComponent } from './column-custom-detail.component';
import { ColumnCustomPopupComponent } from './column-custom-dialog.component';
import { ColumnCustomDeletePopupComponent } from './column-custom-delete-dialog.component';
import {BoardCustom} from "../board-custom/board-custom.model";

@Injectable()
export class ColumnCustomResolvePagingParams implements Resolve<any> {

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

export const columnCustomRoute: Routes = [
    {
        path: 'columncustoms',
        component: ColumnCustomComponent,
        resolve: {
            'pagingParams': ColumnCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ColumnCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'columncustoms/:id',
        component: ColumnCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ColumnCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const columncustomPopupRoute: Routes = [
    {
        path: 'columncustom-new',
        component: ColumnCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ColumnCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'columncustoms/:id/edit',
        component: ColumnCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Columns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'columncustoms/:id/delete',
        component: ColumnCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ColumnCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];
