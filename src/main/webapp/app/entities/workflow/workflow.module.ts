import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    WorkflowService,
    WorkflowPopupService,
    WorkflowComponent,
    WorkflowDetailComponent,
    WorkflowDialogComponent,
    WorkflowPopupComponent,
    WorkflowDeletePopupComponent,
    WorkflowDeleteDialogComponent,
    workflowRoute,
    workflowPopupRoute,
    WorkflowResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...workflowRoute,
    ...workflowPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        WorkflowComponent,
        WorkflowDetailComponent,
        WorkflowDialogComponent,
        WorkflowDeleteDialogComponent,
        WorkflowPopupComponent,
        WorkflowDeletePopupComponent,
    ],
    entryComponents: [
        WorkflowComponent,
        WorkflowDialogComponent,
        WorkflowPopupComponent,
        WorkflowDeleteDialogComponent,
        WorkflowDeletePopupComponent,
    ],
    providers: [
        WorkflowService,
        WorkflowPopupService,
        WorkflowResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardWorkflowModule {}
