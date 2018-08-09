import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    TransitionCustomComponent,
    TransitionCustomDeleteDialogComponent,
    TransitionCustomDeletePopupComponent,
    TransitionCustomDetailComponent,
    TransitionCustomDialogComponent,
    TransitionCustomPopupComponent,
    transitioncustomPopupRoute,
    TransitionCustomPopupService,
    TransitionCustomResolvePagingParams,
    transitionCustomRoute,
    TransitionCustomService,
} from './';
import {SharedModule} from '../../shared/shared.module';

const ENTITY_STATES = [
    ...transitionCustomRoute,
    ...transitioncustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TransitionCustomComponent,
        TransitionCustomDetailComponent,
        TransitionCustomDialogComponent,
        TransitionCustomDeleteDialogComponent,
        TransitionCustomPopupComponent,
        TransitionCustomDeletePopupComponent,
    ],
    entryComponents: [
        TransitionCustomComponent,
        TransitionCustomDialogComponent,
        TransitionCustomPopupComponent,
        TransitionCustomDeleteDialogComponent,
        TransitionCustomDeletePopupComponent,
    ],
    providers: [
        TransitionCustomService,
        TransitionCustomPopupService,
        TransitionCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardTransitionCustomModule {}
