import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { BoardCustomComponent } from './board-custom.component';
import { BoardCustomDetailComponent } from './board-custom-detail.component';
import { BoardCustomPopupComponent } from './board-custom-dialog.component';
import { BoardCustomDeletePopupComponent } from './board-custom-delete-dialog.component';
import {BoardCustomConfigurationComponent} from './board-custom-configuration.component';
import {BoardCustomAgileComponent} from './board-custom-agile.component';

@Injectable()
export class BoardCustomResolvePagingParams implements Resolve<any> {

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

export const boardcustomRoute: Routes = [
    {
        path: 'boardcustoms',
        component: BoardCustomComponent,
        resolve: {
            'pagingParams': BoardCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BoardCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'boardcustoms/:id',
        component: BoardCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BoardCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'boardcustoms/configure/:id',
        component: BoardCustomConfigurationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BoardCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'boardcustoms/agile/:id',
        component: BoardCustomAgileComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BoardCustoms'
        },
        canActivate: [UserRouteAccessService]
    },
];

export const boardcustomPopupRoute: Routes = [
    {
        path: 'boardcustom-new',
        component: BoardCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BoardCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'boardcustoms/:id/edit',
        component: BoardCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Boards'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'boardcustoms/:id/delete',
        component: BoardCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'BoardCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
