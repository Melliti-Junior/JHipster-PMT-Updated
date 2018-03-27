import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ResolutionComponent } from './resolution.component';
import { ResolutionDetailComponent } from './resolution-detail.component';
import { ResolutionPopupComponent } from './resolution-dialog.component';
import { ResolutionDeletePopupComponent } from './resolution-delete-dialog.component';

@Injectable()
export class ResolutionResolvePagingParams implements Resolve<any> {

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

export const resolutionRoute: Routes = [
    {
        path: 'resolution',
        component: ResolutionComponent,
        resolve: {
            'pagingParams': ResolutionResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Resolutions'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'resolution/:id',
        component: ResolutionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Resolutions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const resolutionPopupRoute: Routes = [
    {
        path: 'resolution-new',
        component: ResolutionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Resolutions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resolution/:id/edit',
        component: ResolutionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Resolutions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resolution/:id/delete',
        component: ResolutionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Resolutions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
