import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    VersionCustomComponent,
    VersionCustomDeleteDialogComponent,
    VersionCustomDeletePopupComponent,
    VersionCustomDetailComponent,
    VersionCustomDialogComponent,
    VersionCustomPopupComponent,
    versioncustomPopupRoute,
    VersionCustomPopupService,
    VersionCustomResolvePagingParams,
    versioncustomRoute,
    VersionCustomService,
} from './';
import {SharedModule} from '../../shared/shared.module';

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
