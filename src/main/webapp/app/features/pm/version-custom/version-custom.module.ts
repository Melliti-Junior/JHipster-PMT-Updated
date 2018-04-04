import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    VersionCustomService,
    VersionCustomPopupService,
    VersionCustomComponent,
    VersionCustomDetailComponent,
    VersionCustomDialogComponent,
    VersionCustomPopupComponent,
    VersionCustomDeletePopupComponent,
    VersionCustomDeleteDialogComponent,
    versioncustomRoute,
    versioncustomPopupRoute,
    VersionCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';

const ENTITY_STATES = [
    ...versioncustomRoute,
    ...versioncustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        VersionCustomComponent,
        VersionCustomDetailComponent,
        VersionCustomDialogComponent,
        VersionCustomDeleteDialogComponent,
        VersionCustomPopupComponent,
        VersionCustomDeletePopupComponent,
    ],
    entryComponents: [
        VersionCustomComponent,
        VersionCustomDialogComponent,
        VersionCustomPopupComponent,
        VersionCustomDeleteDialogComponent,
        VersionCustomDeletePopupComponent,
    ],
    providers: [
        VersionCustomService,
        VersionCustomPopupService,
        VersionCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardVersionCustomModule {}
