import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiPaginationUtil} from 'ng-jhipster';

import {UserRouteAccessService} from '../../../shared';
import {ResolutionCustomComponent} from './resolution-custom.component';
import {ResolutionCustomDetailComponent} from './resolution-custom-detail.component';
import {ResolutionCustomPopupComponent} from './resolution-custom-dialog.component';
import {ResolutionCustomDeletePopupComponent} from './resolution-custom-delete-dialog.component';

@Injectable()
export class ResolutionCustomResolvePagingParams implements Resolve<any> {

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

export const resolutionCustomRoute: Routes = [
    {
        path: 'resolutioncustoms',
        component: ResolutionCustomComponent,
        resolve: {
            'pagingParams': ResolutionCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ResolutionCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'resolutioncustoms/:id',
        component: ResolutionCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ResolutionCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const resolutioncustomPopupRoute: Routes = [
    {
        path: 'resolutioncustom-new',
        component: ResolutionCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ResolutionCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resolutioncustoms/:id/edit',
        component: ResolutionCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Resolutions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'resolutioncustoms/:id/delete',
        component: ResolutionCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ResolutionCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
