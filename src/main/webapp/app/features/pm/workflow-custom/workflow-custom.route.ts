import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { WorkflowCustomComponent } from './workflow-custom.component';
import { WorkflowCustomDetailComponent } from './workflow-custom-detail.component';
import { WorkflowCustomPopupComponent } from './workflow-custom-dialog.component';
import { WorkflowCustomDeletePopupComponent } from './workflow-custom-delete-dialog.component';

@Injectable()
export class WorkflowCustomResolvePagingParams implements Resolve<any> {

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

export const workflowCustomRoute: Routes = [
    {
        path: 'workflowcustoms',
        component: WorkflowCustomComponent,
        resolve: {
            'pagingParams': WorkflowCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'WorkflowCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'workflowcustoms/:id',
        component: WorkflowCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'WorkflowCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const workflowcustomPopupRoute: Routes = [
    {
        path: 'workflowcustom-new',
        component: WorkflowCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'WorkflowCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'workflowcustoms/:id/edit',
        component: WorkflowCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Workflows'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'workflowcustoms/:id/delete',
        component: WorkflowCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'WorkflowCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];
