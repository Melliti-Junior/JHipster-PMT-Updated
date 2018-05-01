import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    WorkflowCustomService,
    WorkflowCustomPopupService,
    WorkflowCustomComponent,
    WorkflowCustomDetailComponent,
    WorkflowCustomDialogComponent,
    WorkflowCustomPopupComponent,
    WorkflowCustomDeletePopupComponent,
    WorkflowCustomDeleteDialogComponent,
    workflowCustomRoute,
    workflowcustomPopupRoute,
    WorkflowCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';

const ENTITY_STATES = [
    ...workflowCustomRoute,
    ...workflowcustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        WorkflowCustomComponent,
        WorkflowCustomDetailComponent,
        WorkflowCustomDialogComponent,
        WorkflowCustomDeleteDialogComponent,
        WorkflowCustomPopupComponent,
        WorkflowCustomDeletePopupComponent,
    ],
    entryComponents: [
        WorkflowCustomComponent,
        WorkflowCustomDialogComponent,
        WorkflowCustomPopupComponent,
        WorkflowCustomDeleteDialogComponent,
        WorkflowCustomDeletePopupComponent,
    ],
    providers: [
        WorkflowCustomService,
        WorkflowCustomPopupService,
        WorkflowCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardWorkflowCustomModule {}
