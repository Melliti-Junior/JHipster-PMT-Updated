import {ProjectCustomService} from './project-custom.service';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    ProjectCustomComponent,
    ProjectCustomDeleteDialogComponent,
    ProjectCustomDeletePopupComponent,
    ProjectCustomDetailComponent,
    ProjectCustomDialogComponent,
    ProjectCustomPopupComponent,
    projectcustomPopupRoute,
    ProjectCustomPopupService,
    ProjectCustomResolvePagingParams,
    projectcustomRoute,
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
