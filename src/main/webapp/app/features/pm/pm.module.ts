import { SharedModule } from './../shared/shared.module';
import { PmRoute } from './pm.route';
import { NgModule } from '@angular/core';
import { PmComponent } from './pm.component';
import { RouterModule } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { IssuetypesComponent } from './issuetypes/issuetypes.component';
import { IssueprioritiesComponent } from './issuepriorities/issuepriorities.component';
import { EpicsComponent } from './epics/epics.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([ PmRoute ])
  ],
  declarations: [PmComponent,
    IssuesComponent,
    IssuetypesComponent,
    IssueprioritiesComponent,
    EpicsComponent
]
})
export class PmModule { }
