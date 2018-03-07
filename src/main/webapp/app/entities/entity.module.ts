import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DashBoardEpicModule } from './epic/epic.module';
import { DashBoardIssuePriorityModule } from './issue-priority/issue-priority.module';
import { DashBoardIssueTypeModule } from './issue-type/issue-type.module';
import { DashBoardIssueModule } from './issue/issue.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        DashBoardEpicModule,
        DashBoardIssuePriorityModule,
        DashBoardIssueTypeModule,
        DashBoardIssueModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashBoardEntityModule {}
