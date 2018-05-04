import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategoryCustomComponent } from './category-custom.component';
import { CategoryCustomDetailComponent } from './category-custom-detail.component';
import { CategoryCustomPopupComponent } from './category-custom-dialog.component';
import { CategoryCustomDeletePopupComponent } from './category-custom-delete-dialog.component';
import {UserRouteAccessService} from '../../../shared/index';

@Injectable()
export class CategoryResolvePagingParams implements Resolve<any> {

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

export const categoryCustomRoute: Routes = [
    {
        path: 'categorycustoms',
        component: CategoryCustomComponent,
        resolve: {
            'pagingParams': CategoryResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Categoryes'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'categorycustoms/:id',
        component: CategoryCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Categoryes'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryPopupRoute: Routes = [
    {
        path: 'categorycustom-new',
        component: CategoryCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Categories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'categorycustoms/:id/edit',
        component: CategoryCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Categories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'categorycustoms/:id/delete',
        component: CategoryCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Categories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
