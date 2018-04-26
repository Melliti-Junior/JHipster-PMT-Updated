import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { StepComponent } from './step.component';
import { StepDetailComponent } from './step-detail.component';
import { StepPopupComponent } from './step-dialog.component';
import { StepDeletePopupComponent } from './step-delete-dialog.component';

@Injectable()
export class StepResolvePagingParams implements Resolve<any> {

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

export const stepRoute: Routes = [
    {
        path: 'step',
        component: StepComponent,
        resolve: {
            'pagingParams': StepResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Steps'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'step/:id',
        component: StepDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Steps'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const stepPopupRoute: Routes = [
    {
        path: 'step-new',
        component: StepPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Steps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'step/:id/edit',
        component: StepPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Steps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'step/:id/delete',
        component: StepDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Steps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
