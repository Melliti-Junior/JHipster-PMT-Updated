import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DashBoardEpicModule } from './epic/epic.module';
import { DashBoardIssuePriorityModule } from './issue-priority/issue-priority.module';
import { DashBoardIssueTypeModule } from './issue-type/issue-type.module';
import { DashBoardIssueModule } from './issue/issue.module';
import { DashBoardProjectModule } from './project/project.module';
import { DashBoardProgramModule } from './program/program.module';
import { DashBoardStatusModule } from './status/status.module';
import { DashBoardResolutionModule } from './resolution/resolution.module';
import { DashBoardBoardModule } from './board/board.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        DashBoardEpicModule,
        DashBoardIssuePriorityModule,
        DashBoardIssueTypeModule,
        DashBoardIssueModule,
        DashBoardProjectModule,
        DashBoardProgramModule,
        DashBoardStatusModule,
        DashBoardResolutionModule,
        DashBoardBoardModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardEntityModule {}
