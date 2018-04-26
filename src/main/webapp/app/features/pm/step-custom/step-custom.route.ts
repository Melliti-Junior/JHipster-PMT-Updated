import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { StepCustomComponent } from './step-custom.component';
import { StepCustomDetailComponent } from './step-custom-detail.component';
import { StepCustomPopupComponent } from './step-custom-dialog.component';
import { StepCustomDeletePopupComponent } from './step-custom-delete-dialog.component';

@Injectable()
export class StepCustomResolvePagingParams implements Resolve<any> {

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

export const stepCustomRoute: Routes = [
    {
        path: 'stepcustoms',
        component: StepCustomComponent,
        resolve: {
            'pagingParams': StepCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'StepCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'stepcustoms/:id',
        component: StepCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'StepCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const stepcustomPopupRoute: Routes = [
    {
        path: 'stepcustom-new',
        component: StepCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'StepCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'stepcustoms/:id/edit',
        component: StepCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Steps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'stepcustoms/:id/delete',
        component: StepCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'StepCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];
