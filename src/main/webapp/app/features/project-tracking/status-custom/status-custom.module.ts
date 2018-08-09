import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    StatusCustomComponent,
    StatusCustomDeleteDialogComponent,
    StatusCustomDeletePopupComponent,
    StatusCustomDetailComponent,
    StatusCustomDialogComponent,
    StatusCustomPopupComponent,
    StatusCustomPopupService,
    statusCustomRoute,
    StatusCustomService,
    statusPopupRoute,
    StatusResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...statusCustomRoute,
    ...statusPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        StatusCustomComponent,
        StatusCustomDetailComponent,
        StatusCustomDialogComponent,
        StatusCustomDeleteDialogComponent,
        StatusCustomPopupComponent,
        StatusCustomDeletePopupComponent,
    ],
    entryComponents: [
        StatusCustomComponent,
        StatusCustomDialogComponent,
        StatusCustomPopupComponent,
        StatusCustomDeleteDialogComponent,
        StatusCustomDeletePopupComponent,
    ],
    providers: [
        StatusCustomService,
        StatusCustomPopupService,
        StatusResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardStatusCustomModule {}
