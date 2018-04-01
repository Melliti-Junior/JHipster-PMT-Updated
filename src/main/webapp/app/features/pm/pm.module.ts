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

@NgModule({
  imports: [
    SharedModule,
    DashBoardIssueCustomModule,
    DashBoardProjectCustomModule,
    DashBoardBoardCustomModule,
    RouterModule.forChild([ PmRoute ])
  ],
  declarations: [PmComponent,
    BacklogComponent,
    // ProjectCustomComponent
],
providers: [
]
})
export class PmModule { }
