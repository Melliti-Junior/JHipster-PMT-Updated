import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiPaginationUtil} from 'ng-jhipster';

import {UserRouteAccessService} from '../../../shared';
import {ProjectCustomComponent} from './project-custom.component';
import {ProjectCustomDetailComponent} from './project-custom-detail.component';
import {ProjectCustomPopupComponent} from './project-custom-dialog.component';
import {ProjectCustomDeletePopupComponent} from './project-custom-delete-dialog.component';

@Injectable()
export class ProjectCustomResolvePagingParams implements Resolve<any> {

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

export const projectcustomRoute: Routes = [
    {
        path: 'projectcustoms',
        component: ProjectCustomComponent,
        resolve: {
            'pagingParams': ProjectCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProjectCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'projectcustoms/:id',
        component: ProjectCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProjectCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const projectcustomPopupRoute: Routes = [
    {
        path: 'projectcustom-new',
        component: ProjectCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProjectCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'projectcustoms/:id/edit',
        component: ProjectCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProjectCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'projectcustoms/:id/delete',
        component: ProjectCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProjectCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
