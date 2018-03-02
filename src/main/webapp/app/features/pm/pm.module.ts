import { SharedModule } from './../shared/shared.module';
import { PmRoute } from './pm.route';
import { NgModule } from '@angular/core';
import { PmComponent } from './pm.component';
import { RouterModule } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([ PmRoute ])
  ],
  declarations: [PmComponent,
    IssuesComponent
]
})
export class PmModule { }
