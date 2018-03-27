import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    ResolutionService,
    ResolutionPopupService,
    ResolutionComponent,
    ResolutionDetailComponent,
    ResolutionDialogComponent,
    ResolutionPopupComponent,
    ResolutionDeletePopupComponent,
    ResolutionDeleteDialogComponent,
    resolutionRoute,
    resolutionPopupRoute,
    ResolutionResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...resolutionRoute,
    ...resolutionPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ResolutionComponent,
        ResolutionDetailComponent,
        ResolutionDialogComponent,
        ResolutionDeleteDialogComponent,
        ResolutionPopupComponent,
        ResolutionDeletePopupComponent,
    ],
    entryComponents: [
        ResolutionComponent,
        ResolutionDialogComponent,
        ResolutionPopupComponent,
        ResolutionDeleteDialogComponent,
        ResolutionDeletePopupComponent,
    ],
    providers: [
        ResolutionService,
        ResolutionPopupService,
        ResolutionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardResolutionModule {}
