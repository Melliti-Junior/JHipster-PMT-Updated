import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashBoardSharedModule } from '../../../shared';
import {
    StepCustomService,
    StepCustomPopupService,
    StepCustomComponent,
    StepCustomDetailComponent,
    StepCustomDialogComponent,
    StepCustomPopupComponent,
    StepCustomDeletePopupComponent,
    StepCustomDeleteDialogComponent,
    stepCustomRoute,
    stepcustomPopupRoute,
    StepCustomResolvePagingParams,
} from './';
import { SharedModule } from '../../shared/shared.module';

const ENTITY_STATES = [
    ...stepCustomRoute,
    ...stepcustomPopupRoute,
];

@NgModule({
    imports: [
        DashBoardSharedModule,
        SharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        StepCustomComponent,
        StepCustomDetailComponent,
        StepCustomDialogComponent,
        StepCustomDeleteDialogComponent,
        StepCustomPopupComponent,
        StepCustomDeletePopupComponent,
    ],
    entryComponents: [
        StepCustomComponent,
        StepCustomDialogComponent,
        StepCustomPopupComponent,
        StepCustomDeleteDialogComponent,
        StepCustomDeletePopupComponent,
    ],
    providers: [
        StepCustomService,
        StepCustomPopupService,
        StepCustomResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardStepCustomModule {}
