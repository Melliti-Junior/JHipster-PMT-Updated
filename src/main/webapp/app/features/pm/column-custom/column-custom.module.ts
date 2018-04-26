import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    ColumnCustomService,
    ColumnCustomPopupService,
    ColumnCustomComponent,
    ColumnCustomDetailComponent,
    ColumnCustomDialogComponent,
    ColumnCustomPopupComponent,
    ColumnCustomDeletePopupComponent,
    ColumnCustomDeleteDialogComponent,
    columnCustomRoute,
    columncustomPopupRoute,
    ColumnCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';

const ENTITY_STATES = [
    ...columnCustomRoute,
    ...columncustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ColumnCustomComponent,
        ColumnCustomDetailComponent,
        ColumnCustomDialogComponent,
        ColumnCustomDeleteDialogComponent,
        ColumnCustomPopupComponent,
        ColumnCustomDeletePopupComponent,
    ],
    entryComponents: [
        ColumnCustomComponent,
        ColumnCustomDialogComponent,
        ColumnCustomPopupComponent,
        ColumnCustomDeleteDialogComponent,
        ColumnCustomDeletePopupComponent,
    ],
    providers: [
        ColumnCustomService,
        ColumnCustomPopupService,
        ColumnCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardColumnCustomModule {}
