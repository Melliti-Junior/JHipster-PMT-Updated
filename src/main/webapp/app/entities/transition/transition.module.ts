import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    TransitionService,
    TransitionPopupService,
    TransitionComponent,
    TransitionDetailComponent,
    TransitionDialogComponent,
    TransitionPopupComponent,
    TransitionDeletePopupComponent,
    TransitionDeleteDialogComponent,
    transitionRoute,
    transitionPopupRoute,
    TransitionResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...transitionRoute,
    ...transitionPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TransitionComponent,
        TransitionDetailComponent,
        TransitionDialogComponent,
        TransitionDeleteDialogComponent,
        TransitionPopupComponent,
        TransitionDeletePopupComponent,
    ],
    entryComponents: [
        TransitionComponent,
        TransitionDialogComponent,
        TransitionPopupComponent,
        TransitionDeleteDialogComponent,
        TransitionDeletePopupComponent,
    ],
    providers: [
        TransitionService,
        TransitionPopupService,
        TransitionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardTransitionModule {}
