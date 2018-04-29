import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    StatusCustomService,
    StatusCustomPopupService,
    StatusCustomComponent,
    StatusCustomDetailComponent,
    StatusCustomDialogComponent,
    StatusCustomPopupComponent,
    StatusCustomDeletePopupComponent,
    StatusCustomDeleteDialogComponent,
    statusCustomRoute,
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
