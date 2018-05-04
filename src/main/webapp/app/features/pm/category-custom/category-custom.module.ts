import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared/index';
import {
    CategoryCustomService,
    CategoryCustomPopupService,
    CategoryCustomComponent,
    CategoryCustomDetailComponent,
    CategoryCustomDialogComponent,
    CategoryCustomPopupComponent,
    CategoryCustomDeletePopupComponent,
    CategoryCustomDeleteDialogComponent,
    categoryCustomRoute,
    categoryPopupRoute,
    CategoryResolvePagingParams,
} from './index';

const ENTITY_STATES = [
    ...categoryCustomRoute,
    ...categoryPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CategoryCustomComponent,
        CategoryCustomDetailComponent,
        CategoryCustomDialogComponent,
        CategoryCustomDeleteDialogComponent,
        CategoryCustomPopupComponent,
        CategoryCustomDeletePopupComponent,
    ],
    entryComponents: [
        CategoryCustomComponent,
        CategoryCustomDialogComponent,
        CategoryCustomPopupComponent,
        CategoryCustomDeleteDialogComponent,
        CategoryCustomDeletePopupComponent,
    ],
    providers: [
        CategoryCustomService,
        CategoryCustomPopupService,
        CategoryResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardCategoryCustomModule {}
