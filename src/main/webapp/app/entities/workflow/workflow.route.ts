import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { WorkflowComponent } from './workflow.component';
import { WorkflowDetailComponent } from './workflow-detail.component';
import { WorkflowPopupComponent } from './workflow-dialog.component';
import { WorkflowDeletePopupComponent } from './workflow-delete-dialog.component';

@Injectable()
export class WorkflowResolvePagingParams implements Resolve<any> {

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

export const workflowRoute: Routes = [
    {
        path: 'workflow',
        component: WorkflowComponent,
        resolve: {
            'pagingParams': WorkflowResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Workflows'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'workflow/:id',
        component: WorkflowDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Workflows'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const workflowPopupRoute: Routes = [
    {
        path: 'workflow-new',
        component: WorkflowPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Workflows'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'workflow/:id/edit',
        component: WorkflowPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Workflows'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'workflow/:id/delete',
        component: WorkflowDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Workflows'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
