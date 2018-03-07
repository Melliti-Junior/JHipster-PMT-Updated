import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    EpicService,
    EpicPopupService,
    EpicComponent,
    EpicDetailComponent,
    EpicDialogComponent,
    EpicPopupComponent,
    EpicDeletePopupComponent,
    EpicDeleteDialogComponent,
    epicRoute,
    epicPopupRoute,
    EpicResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...epicRoute,
    ...epicPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EpicComponent,
        EpicDetailComponent,
        EpicDialogComponent,
        EpicDeleteDialogComponent,
        EpicPopupComponent,
        EpicDeletePopupComponent,
    ],
    entryComponents: [
        EpicComponent,
        EpicDialogComponent,
        EpicPopupComponent,
        EpicDeleteDialogComponent,
        EpicDeletePopupComponent,
    ],
    providers: [
        EpicService,
        EpicPopupService,
        EpicResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardEpicModule {}
