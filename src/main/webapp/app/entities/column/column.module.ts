import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    ColumnService,
    ColumnPopupService,
    ColumnComponent,
    ColumnDetailComponent,
    ColumnDialogComponent,
    ColumnPopupComponent,
    ColumnDeletePopupComponent,
    ColumnDeleteDialogComponent,
    columnRoute,
    columnPopupRoute,
    ColumnResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...columnRoute,
    ...columnPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ColumnComponent,
        ColumnDetailComponent,
        ColumnDialogComponent,
        ColumnDeleteDialogComponent,
        ColumnPopupComponent,
        ColumnDeletePopupComponent,
    ],
    entryComponents: [
        ColumnComponent,
        ColumnDialogComponent,
        ColumnPopupComponent,
        ColumnDeleteDialogComponent,
        ColumnDeletePopupComponent,
    ],
    providers: [
        ColumnService,
        ColumnPopupService,
        ColumnResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardColumnModule {}
