import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashBoardSharedModule} from '../../../shared';
import {
    ResolutionCustomComponent,
    ResolutionCustomDeleteDialogComponent,
    ResolutionCustomDeletePopupComponent,
    ResolutionCustomDetailComponent,
    ResolutionCustomDialogComponent,
    ResolutionCustomPopupComponent,
    resolutioncustomPopupRoute,
    ResolutionCustomPopupService,
    ResolutionCustomResolvePagingParams,
    resolutionCustomRoute,
    ResolutionCustomService,
} from './';
import {SharedModule} from '../../shared/shared.module';

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
