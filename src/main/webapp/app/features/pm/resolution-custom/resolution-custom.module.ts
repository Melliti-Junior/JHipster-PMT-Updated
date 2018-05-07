import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    ResolutionCustomService,
    ResolutionCustomPopupService,
    ResolutionCustomComponent,
    ResolutionCustomDetailComponent,
    ResolutionCustomDialogComponent,
    ResolutionCustomPopupComponent,
    ResolutionCustomDeletePopupComponent,
    ResolutionCustomDeleteDialogComponent,
    resolutionCustomRoute,
    resolutioncustomPopupRoute,
    ResolutionCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';

const ENTITY_STATES = [
    ...resolutionCustomRoute,
    ...resolutioncustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ResolutionCustomComponent,
        ResolutionCustomDetailComponent,
        ResolutionCustomDialogComponent,
        ResolutionCustomDeleteDialogComponent,
        ResolutionCustomPopupComponent,
        ResolutionCustomDeletePopupComponent,
    ],
    entryComponents: [
        ResolutionCustomComponent,
        ResolutionCustomDialogComponent,
        ResolutionCustomPopupComponent,
        ResolutionCustomDeleteDialogComponent,
        ResolutionCustomDeletePopupComponent,
    ],
    providers: [
        ResolutionCustomService,
        ResolutionCustomPopupService,
        ResolutionCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardResolutionCustomModule {}
