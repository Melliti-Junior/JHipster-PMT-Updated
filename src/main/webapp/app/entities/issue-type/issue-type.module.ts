import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    IssueTypeService,
    IssueTypePopupService,
    IssueTypeComponent,
    IssueTypeDetailComponent,
    IssueTypeDialogComponent,
    IssueTypePopupComponent,
    IssueTypeDeletePopupComponent,
    IssueTypeDeleteDialogComponent,
    issueTypeRoute,
    issueTypePopupRoute,
    IssueTypeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...issueTypeRoute,
    ...issueTypePopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        IssueTypeComponent,
        IssueTypeDetailComponent,
        IssueTypeDialogComponent,
        IssueTypeDeleteDialogComponent,
        IssueTypePopupComponent,
        IssueTypeDeletePopupComponent,
    ],
    entryComponents: [
        IssueTypeComponent,
        IssueTypeDialogComponent,
        IssueTypePopupComponent,
        IssueTypeDeleteDialogComponent,
        IssueTypeDeletePopupComponent,
    ],
    providers: [
        IssueTypeService,
        IssueTypePopupService,
        IssueTypeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardIssueTypeModule {}
