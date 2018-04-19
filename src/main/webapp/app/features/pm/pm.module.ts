import { SharedModule } from './../shared/shared.module';
import { PmRoute } from './pm.route';
import { NgModule } from '@angular/core';
import { PmComponent } from './pm.component';
import { RouterModule } from '@angular/router';
import { IssueCustomComponent } from './issue-custom';
import { DashBoardIssueCustomModule } from './issue-custom/issue-custom.module';
import { BacklogComponent } from './backlog/backlog.component';
import { ProjectCustomComponent } from './project-custom/project-custom.component';
import { DashBoardProjectCustomModule } from './project-custom/project-custom.module';
import { DashBoardBoardCustomModule } from './board-custom/board-custom.module';
import {DashBoardVersionCustomModule} from './version-custom/version-custom.module';
import {DashBoardSprintCustomModule} from './sprint-custom/sprint-custom.module';
import {AgileComponent} from './agile';

@NgModule({
  imports: [
    SharedModule,
    DashBoardIssueCustomModule,
    DashBoardProjectCustomModule,
    DashBoardBoardCustomModule,
    DashBoardVersionCustomModule,
    DashBoardSprintCustomModule,
    RouterModule.forChild([ PmRoute ])
  ],
  declarations: [PmComponent,
    BacklogComponent,
      AgileComponent,
    // ProjectCustomComponent
],
providers: [
]
})
export class PmModule { }
