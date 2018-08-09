import {ProjectManagementModule} from './project-tracking/project-management.module';
import {HttpModule} from '@angular/http';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FeaturesComponent} from './features.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {featuresState} from './features.route';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      HttpModule,
      RouterModule.forChild(featuresState),
      ProjectManagementModule
  ],
  declarations: [
      FeaturesComponent,
    ]
})
export class FeaturesModule { }
