import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    BoardCustomService,
    BoardCustomPopupService,
    BoardCustomComponent,
    BoardCustomDetailComponent,
    BoardCustomDialogComponent,
    BoardCustomPopupComponent,
    BoardCustomDeletePopupComponent,
    BoardCustomDeleteDialogComponent,
    boardcustomRoute,
    boardcustomPopupRoute,
    BoardCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';

const ENTITY_STATES = [
    ...boardcustomRoute,
    ...boardcustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        BoardCustomComponent,
        BoardCustomDetailComponent,
        BoardCustomDialogComponent,
        BoardCustomDeleteDialogComponent,
        BoardCustomPopupComponent,
        BoardCustomDeletePopupComponent,
    ],
    entryComponents: [
        BoardCustomComponent,
        BoardCustomDialogComponent,
        BoardCustomPopupComponent,
        BoardCustomDeleteDialogComponent,
        BoardCustomDeletePopupComponent,
    ],
    providers: [
        BoardCustomService,
        BoardCustomPopupService,
        BoardCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardBoardCustomModule {}
