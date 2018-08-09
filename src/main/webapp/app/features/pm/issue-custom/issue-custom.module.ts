import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    IssueCustomComponent,
    IssueCustomDeleteDialogComponent,
    IssueCustomDeletePopupComponent,
    IssueCustomDetailComponent,
    IssueCustomDialogComponent,
    IssueCustomPopupComponent,
    issuecustomPopupRoute,
    IssueCustomPopupService,
    IssueCustomResolvePagingParams,
    issuecustomRoute,
    IssueCustomService,
} from './';
import {SharedModule} from '../../shared/shared.module';
import {
    IssueCustomResolveDialogComponent,
    IssueCustomResolvePopupComponent
} from './issue-custom-resolve-dialog.component';
import {
    IssueCustomAssignDialogComponent,
    IssueCustomAssignPopupComponent
} from './issue-custom-assign-dialog.component';

const ENTITY_STATES = [
    ...issuecustomRoute,
    ...issuecustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        IssueCustomComponent,
        IssueCustomDetailComponent,
        IssueCustomDialogComponent,
        IssueCustomDeleteDialogComponent,
        IssueCustomPopupComponent,
        IssueCustomDeletePopupComponent,
        IssueCustomResolveDialogComponent,
        IssueCustomResolvePopupComponent,
        IssueCustomAssignDialogComponent,
        IssueCustomAssignPopupComponent,
    ],
    entryComponents: [
        IssueCustomComponent,
        IssueCustomDialogComponent,
        IssueCustomPopupComponent,
        IssueCustomDeleteDialogComponent,
        IssueCustomDeletePopupComponent,
        IssueCustomResolveDialogComponent,
        IssueCustomResolvePopupComponent,
        IssueCustomAssignDialogComponent,
        IssueCustomAssignPopupComponent,
    ],
    providers: [
        IssueCustomService,
        IssueCustomPopupService,
        IssueCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardIssueCustomModule {}
