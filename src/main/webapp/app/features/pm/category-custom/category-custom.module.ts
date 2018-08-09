import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared/index';
import {
    CategoryCustomComponent,
    CategoryCustomDeleteDialogComponent,
    CategoryCustomDeletePopupComponent,
    CategoryCustomDetailComponent,
    CategoryCustomDialogComponent,
    CategoryCustomPopupComponent,
    CategoryCustomPopupService,
    categoryCustomRoute,
    CategoryCustomService,
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
