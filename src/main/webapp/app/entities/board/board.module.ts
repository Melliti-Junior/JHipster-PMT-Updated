import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    BoardService,
    BoardPopupService,
    BoardComponent,
    BoardDetailComponent,
    BoardDialogComponent,
    BoardPopupComponent,
    BoardDeletePopupComponent,
    BoardDeleteDialogComponent,
    boardRoute,
    boardPopupRoute,
    BoardResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...boardRoute,
    ...boardPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        BoardComponent,
        BoardDetailComponent,
        BoardDialogComponent,
        BoardDeleteDialogComponent,
        BoardPopupComponent,
        BoardDeletePopupComponent,
    ],
    entryComponents: [
        BoardComponent,
        BoardDialogComponent,
        BoardPopupComponent,
        BoardDeleteDialogComponent,
        BoardDeletePopupComponent,
    ],
    providers: [
        BoardService,
        BoardPopupService,
        BoardResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardBoardModule {}
