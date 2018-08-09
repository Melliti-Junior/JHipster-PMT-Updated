import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiPaginationUtil} from 'ng-jhipster';

import {UserRouteAccessService} from '../../../shared';
import {TransitionCustomComponent} from './transition-custom.component';
import {TransitionCustomDetailComponent} from './transition-custom-detail.component';
import {TransitionCustomPopupComponent} from './transition-custom-dialog.component';
import {TransitionCustomDeletePopupComponent} from './transition-custom-delete-dialog.component';

@Injectable()
export class TransitionCustomResolvePagingParams implements Resolve<any> {

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

export const transitionCustomRoute: Routes = [
    {
        path: 'transitioncustoms',
        component: TransitionCustomComponent,
        resolve: {
            'pagingParams': TransitionCustomResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TransitionCustoms'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'transitioncustoms/:id',
        component: TransitionCustomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TransitionCustoms'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const transitioncustomPopupRoute: Routes = [
    {
        path: 'transitioncustom-new',
        component: TransitionCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TransitionCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'transitioncustoms/:id/edit',
        component: TransitionCustomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Transitions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'transitioncustoms/:id/delete',
        component: TransitionCustomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TransitionCustoms'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];
