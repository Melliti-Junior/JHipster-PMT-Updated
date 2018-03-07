import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    IssueService,
    IssuePopupService,
    IssueComponent,
    IssueDetailComponent,
    IssueDialogComponent,
    IssuePopupComponent,
    IssueDeletePopupComponent,
    IssueDeleteDialogComponent,
    issueRoute,
    issuePopupRoute,
    IssueResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...issueRoute,
    ...issuePopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        IssueComponent,
        IssueDetailComponent,
        IssueDialogComponent,
        IssueDeleteDialogComponent,
        IssuePopupComponent,
        IssueDeletePopupComponent,
    ],
    entryComponents: [
        IssueComponent,
        IssueDialogComponent,
        IssuePopupComponent,
        IssueDeleteDialogComponent,
        IssueDeletePopupComponent,
    ],
    providers: [
        IssueService,
        IssuePopupService,
        IssueResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardIssueModule {}
