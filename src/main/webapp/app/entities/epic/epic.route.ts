import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { EpicComponent } from './epic.component';
import { EpicDetailComponent } from './epic-detail.component';
import { EpicPopupComponent } from './epic-dialog.component';
import { EpicDeletePopupComponent } from './epic-delete-dialog.component';

@Injectable()
export class EpicResolvePagingParams implements Resolve<any> {

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

export const epicRoute: Routes = [
    {
        path: 'epic',
        component: EpicComponent,
        resolve: {
            'pagingParams': EpicResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Epics'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'epic/:id',
        component: EpicDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Epics'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const epicPopupRoute: Routes = [
    {
        path: 'epic-new',
        component: EpicPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Epics'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'epic/:id/edit',
        component: EpicPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Epics'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'epic/:id/delete',
        component: EpicDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Epics'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
