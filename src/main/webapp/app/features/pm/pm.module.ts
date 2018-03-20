import { SharedModule } from './../shared/shared.module';
import { PmRoute } from './pm.route';
import { NgModule } from '@angular/core';
import { PmComponent } from './pm.component';
import { RouterModule } from '@angular/router';
import { IssueCustomComponent } from './issue-custom';
import { DashBoardIssueCustomModule } from './issue-custom/issue-custom.module';
import { BacklogComponent } from './backlog/backlog.component';

@NgModule({
  imports: [
    SharedModule,
    DashBoardIssueCustomModule,
    RouterModule.forChild([ PmRoute ])
  ],
  declarations: [PmComponent,
    BacklogComponent
],
providers: [
]
})
export class PmModule { }
