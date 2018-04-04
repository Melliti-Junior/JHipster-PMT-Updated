import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../../shared';
import { VersionCustomComponent } from './version-custom.component';
import { VersionCustomDetailComponent } from './version-custom-detail.component';
import { VersionCustomPopupComponent } from './version-custom-dialog.component';
import { VersionCustomDeletePopupComponent } from './version-custom-delete-dialog.component';

@Injectable()
export class VersionCustomResolvePagingParams implements Resolve<any> {

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

export const versioncustomRoute: Routes = [
    {
        path: 'versioncustoms',
        component: VersionCustomComponent,
        resolve: {
            'pagingParams': VersionCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'VersionCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'versioncustoms/:id',
        component: VersionCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'VersionCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const versioncustomPopupRoute: Routes = [
    {
        path: 'versioncustom-new',
        component: VersionCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'VersionCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'versioncustoms/:id/edit',
        component: VersionCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Versions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'versioncustoms/:id/delete',
        component: VersionCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'VersionCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
