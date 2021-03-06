import {SharedModule} from './../shared/shared.module';
import {ProjectManagementRoute} from './project-management.route';
import {NgModule} from '@angular/core';
import {ProjectManagementComponent} from './project-management.component';
import {RouterModule} from '@angular/router';
import {DashBoardIssueCustomModule} from './issue-custom/issue-custom.module';
import {BacklogComponent} from './backlog/backlog.component';
import {DashBoardProjectCustomModule} from './project-custom/project-custom.module';
import {DashBoardBoardCustomModule} from './board-custom/board-custom.module';
import {DashBoardVersionCustomModule} from './version-custom/version-custom.module';
import {DashBoardSprintCustomModule} from './sprint-custom/sprint-custom.module';
import {DashBoardColumnCustomModule} from './column-custom/column-custom.module';
import {AgileComponent} from './agile';
import {DashBoardStepCustomModule} from './step-custom/step-custom.module';
import {DashBoardStatusCustomModule} from './status-custom/status-custom.module';
import {DashBoardWorkflowCustomModule} from './workflow-custom/workflow-custom.module';
import {DashBoardTransitionCustomModule} from './transition-custom/transition-custom.module';
import {DashBoardCategoryCustomModule} from './category-custom/category-custom.module';
import {ProjectManagementHomeComponent} from './project-management-home/project-management-home.component';
import {DashBoardResolutionCustomModule} from './resolution-custom/resolution-custom.module';

@NgModule({
  imports: [
    SharedModule,
    DashBoardIssueCustomModule,
    DashBoardProjectCustomModule,
    DashBoardBoardCustomModule,
    DashBoardVersionCustomModule,
    DashBoardSprintCustomModule,
    DashBoardColumnCustomModule,
    DashBoardStepCustomModule,
    DashBoardStatusCustomModule,
    DashBoardWorkflowCustomModule,
    DashBoardTransitionCustomModule,
    DashBoardCategoryCustomModule,
    DashBoardResolutionCustomModule,
    RouterModule.forChild([ ProjectManagementRoute ])
  ],
  declarations: [ProjectManagementComponent,
    BacklogComponent,
      AgileComponent,
      ProjectManagementHomeComponent,
    // ProjectCustomComponent
],
providers: [
]
})
export class ProjectManagementModule {
}
