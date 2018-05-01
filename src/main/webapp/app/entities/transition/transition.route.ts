import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { TransitionComponent } from './transition.component';
import { TransitionDetailComponent } from './transition-detail.component';
import { TransitionPopupComponent } from './transition-dialog.component';
import { TransitionDeletePopupComponent } from './transition-delete-dialog.component';

@Injectable()
export class TransitionResolvePagingParams implements Resolve<any> {

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

export const transitionRoute: Routes = [
    {
        path: 'transition',
        component: TransitionComponent,
        resolve: {
            'pagingParams': TransitionResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Transitions'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'transition/:id',
        component: TransitionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Transitions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const transitionPopupRoute: Routes = [
    {
        path: 'transition-new',
        component: TransitionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Transitions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'transition/:id/edit',
        component: TransitionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Transitions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'transition/:id/delete',
        component: TransitionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Transitions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
