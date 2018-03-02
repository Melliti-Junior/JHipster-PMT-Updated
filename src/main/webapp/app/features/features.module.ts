import { PmModule } from './pm/pm.module';
import { HttpModule } from '@angular/http';
import { PmComponent } from './pm/pm.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesComponent } from './features.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { featuresState } from './features.route';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      HttpModule,
      RouterModule.forChild(featuresState),
      PmModule
  ],
  declarations: [
      FeaturesComponent,
]
})
export class FeaturesModule { }
