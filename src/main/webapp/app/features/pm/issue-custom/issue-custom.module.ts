import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    IssueCustomService,
    IssueCustomPopupService,
    IssueCustomComponent,
    IssueCustomDetailComponent,
    IssueCustomDialogComponent,
    IssueCustomPopupComponent,
    IssueCustomDeletePopupComponent,
    IssueCustomDeleteDialogComponent,
    issuecustomRoute,
    issuecustomPopupRoute,
    IssueCustomResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...issuecustomRoute,
    ...issuecustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        IssueCustomComponent,
        IssueCustomDetailComponent,
        IssueCustomDialogComponent,
        IssueCustomDeleteDialogComponent,
        IssueCustomPopupComponent,
        IssueCustomDeletePopupComponent,
    ],
    entryComponents: [
        IssueCustomComponent,
        IssueCustomDialogComponent,
        IssueCustomPopupComponent,
        IssueCustomDeleteDialogComponent,
        IssueCustomDeletePopupComponent,
    ],
    providers: [
        IssueCustomService,
        IssueCustomPopupService,
        IssueCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardIssueCustomModule {}
