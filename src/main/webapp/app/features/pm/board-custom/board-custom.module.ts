import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    BoardCustomAgileComponent,
    BoardCustomComponent,
    BoardCustomConfigurationComponent,
    BoardCustomDeleteDialogComponent,
    BoardCustomDeletePopupComponent,
    BoardCustomDetailComponent,
    BoardCustomDialogComponent,
    BoardCustomPopupComponent,
    boardcustomPopupRoute,
    BoardCustomPopupService,
    BoardCustomResolvePagingParams,
    boardcustomRoute,
    BoardCustomService,
} from './';
import {SharedModule} from '../../shared/shared.module';

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
        BoardCustomConfigurationComponent,
        BoardCustomAgileComponent
    ],
    entryComponents: [
        BoardCustomComponent,
        BoardCustomDialogComponent,
        BoardCustomPopupComponent,
        BoardCustomDeleteDialogComponent,
        BoardCustomDeletePopupComponent,
        BoardCustomConfigurationComponent,
        BoardCustomAgileComponent
    ],
    providers: [
        BoardCustomService,
        BoardCustomPopupService,
        BoardCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardBoardCustomModule {}
