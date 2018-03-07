import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    IssuePriorityService,
    IssuePriorityPopupService,
    IssuePriorityComponent,
    IssuePriorityDetailComponent,
    IssuePriorityDialogComponent,
    IssuePriorityPopupComponent,
    IssuePriorityDeletePopupComponent,
    IssuePriorityDeleteDialogComponent,
    issuePriorityRoute,
    issuePriorityPopupRoute,
    IssuePriorityResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...issuePriorityRoute,
    ...issuePriorityPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        IssuePriorityComponent,
        IssuePriorityDetailComponent,
        IssuePriorityDialogComponent,
        IssuePriorityDeleteDialogComponent,
        IssuePriorityPopupComponent,
        IssuePriorityDeletePopupComponent,
    ],
    entryComponents: [
        IssuePriorityComponent,
        IssuePriorityDialogComponent,
        IssuePriorityPopupComponent,
        IssuePriorityDeleteDialogComponent,
        IssuePriorityDeletePopupComponent,
    ],
    providers: [
        IssuePriorityService,
        IssuePriorityPopupService,
        IssuePriorityResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardIssuePriorityModule {}
