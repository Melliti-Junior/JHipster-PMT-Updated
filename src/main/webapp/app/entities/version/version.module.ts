import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    VersionService,
    VersionPopupService,
    VersionComponent,
    VersionDetailComponent,
    VersionDialogComponent,
    VersionPopupComponent,
    VersionDeletePopupComponent,
    VersionDeleteDialogComponent,
    versionRoute,
    versionPopupRoute,
    VersionResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...versionRoute,
    ...versionPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        VersionComponent,
        VersionDetailComponent,
        VersionDialogComponent,
        VersionDeleteDialogComponent,
        VersionPopupComponent,
        VersionDeletePopupComponent,
    ],
    entryComponents: [
        VersionComponent,
        VersionDialogComponent,
        VersionPopupComponent,
        VersionDeleteDialogComponent,
        VersionDeletePopupComponent,
    ],
    providers: [
        VersionService,
        VersionPopupService,
        VersionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardVersionModule {}
