import { ProjectCustomService } from './project-custom.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    ProjectCustomPopupService,
    ProjectCustomComponent,
    ProjectCustomDetailComponent,
    ProjectCustomDialogComponent,
    ProjectCustomPopupComponent,
    ProjectCustomDeletePopupComponent,
    ProjectCustomDeleteDialogComponent,
    projectcustomRoute,
    projectcustomPopupRoute,
    ProjectCustomResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...projectcustomRoute,
    ...projectcustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ProjectCustomComponent,
        ProjectCustomDetailComponent,
        ProjectCustomDialogComponent,
        ProjectCustomDeleteDialogComponent,
        ProjectCustomPopupComponent,
        ProjectCustomDeletePopupComponent,
    ],
    entryComponents: [
        ProjectCustomComponent,
        ProjectCustomDialogComponent,
        ProjectCustomPopupComponent,
        ProjectCustomDeleteDialogComponent,
        ProjectCustomDeletePopupComponent,
    ],
    providers: [
        ProjectCustomService,
        ProjectCustomPopupService,
        ProjectCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardProjectCustomModule {}
