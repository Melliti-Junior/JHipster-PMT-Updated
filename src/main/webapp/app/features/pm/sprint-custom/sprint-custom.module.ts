import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    SprintCustomService,
    SprintCustomPopupService,
    SprintCustomComponent,
    SprintCustomDetailComponent,
    SprintCustomDialogComponent,
    SprintCustomPopupComponent,
    SprintCustomDeletePopupComponent,
    SprintCustomDeleteDialogComponent,
    sprintcustomRoute,
    sprintcustomPopupRoute,
    SprintCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';
import {
    SprintCustomStartDialogComponent,
    SprintCustomStartPopupComponent
} from './sprint-custom-start-dialog.component';
import {
    SprintCustomCompleteDialogComponent,
    SprintCustomCompletePopupComponent
} from './sprint-custom-complete-dialog.component';

const ENTITY_STATES = [
    ...sprintcustomRoute,
    ...sprintcustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SprintCustomComponent,
        SprintCustomDetailComponent,
        SprintCustomDialogComponent,
        SprintCustomDeleteDialogComponent,
        SprintCustomPopupComponent,
        SprintCustomDeletePopupComponent,
        SprintCustomStartDialogComponent,
        SprintCustomStartPopupComponent,
        SprintCustomCompleteDialogComponent,
        SprintCustomCompletePopupComponent,
    ],
    entryComponents: [
        SprintCustomComponent,
        SprintCustomDialogComponent,
        SprintCustomPopupComponent,
        SprintCustomDeleteDialogComponent,
        SprintCustomDeletePopupComponent,
        SprintCustomStartDialogComponent,
        SprintCustomStartPopupComponent,
        SprintCustomCompleteDialogComponent,
        SprintCustomCompletePopupComponent,
    ],
    providers: [
        SprintCustomService,
        SprintCustomPopupService,
        SprintCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardSprintCustomModule {}
