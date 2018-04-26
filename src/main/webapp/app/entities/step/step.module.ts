import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../shared';
import {
    StepService,
    StepPopupService,
    StepComponent,
    StepDetailComponent,
    StepDialogComponent,
    StepPopupComponent,
    StepDeletePopupComponent,
    StepDeleteDialogComponent,
    stepRoute,
    stepPopupRoute,
    StepResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...stepRoute,
    ...stepPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        StepComponent,
        StepDetailComponent,
        StepDialogComponent,
        StepDeleteDialogComponent,
        StepPopupComponent,
        StepDeletePopupComponent,
    ],
    entryComponents: [
        StepComponent,
        StepDialogComponent,
        StepPopupComponent,
        StepDeleteDialogComponent,
        StepDeletePopupComponent,
    ],
    providers: [
        StepService,
        StepPopupService,
        StepResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardStepModule {}
