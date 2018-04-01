import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { BoardComponent } from './board.component';
import { BoardDetailComponent } from './board-detail.component';
import { BoardPopupComponent } from './board-dialog.component';
import { BoardDeletePopupComponent } from './board-delete-dialog.component';

@Injectable()
export class BoardResolvePagingParams implements Resolve<any> {

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

export const boardRoute: Routes = [
    {
        path: 'board',
        component: BoardComponent,
        resolve: {
            'pagingParams': BoardResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Boards'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'board/:id',
        component: BoardDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Boards'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const boardPopupRoute: Routes = [
    {
        path: 'board-new',
        component: BoardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Boards'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'board/:id/edit',
        component: BoardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Boards'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'board/:id/delete',
        component: BoardDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Boards'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
