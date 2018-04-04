import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { VersionComponent } from './version.component';
import { VersionDetailComponent } from './version-detail.component';
import { VersionPopupComponent } from './version-dialog.component';
import { VersionDeletePopupComponent } from './version-delete-dialog.component';

@Injectable()
export class VersionResolvePagingParams implements Resolve<any> {

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

export const versionRoute: Routes = [
    {
        path: 'version',
        component: VersionComponent,
        resolve: {
            'pagingParams': VersionResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Versions'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'version/:id',
        component: VersionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Versions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const versionPopupRoute: Routes = [
    {
        path: 'version-new',
        component: VersionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Versions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'version/:id/edit',
        component: VersionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Versions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'version/:id/delete',
        component: VersionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Versions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
