import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    SprintService,
    SprintPopupService,
    SprintComponent,
    SprintDetailComponent,
    SprintDialogComponent,
    SprintPopupComponent,
    SprintDeletePopupComponent,
    SprintDeleteDialogComponent,
    sprintRoute,
    sprintPopupRoute,
    SprintResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...sprintRoute,
    ...sprintPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SprintComponent,
        SprintDetailComponent,
        SprintDialogComponent,
        SprintDeleteDialogComponent,
        SprintPopupComponent,
        SprintDeletePopupComponent,
    ],
    entryComponents: [
        SprintComponent,
        SprintDialogComponent,
        SprintPopupComponent,
        SprintDeleteDialogComponent,
        SprintDeletePopupComponent,
    ],
    providers: [
        SprintService,
        SprintPopupService,
        SprintResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardSprintModule {}
