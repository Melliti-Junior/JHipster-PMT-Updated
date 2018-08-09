import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedComponent} from './shared.component';

import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {AccordionModule, ButtonModule, CalendarModule, RatingModule} from 'primeng/primeng';
import {CardModule} from 'primeng/card';
import {PanelModule} from 'primeng/panel';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenubarModule} from 'primeng/menubar';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TabMenuModule} from 'primeng/tabmenu';
import {DashBoardEntityModule} from '../../entities/entity.module';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MatAutocompleteModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    AccordionModule,
    RatingModule,
    CalendarModule,
    ButtonModule,
    CardModule,
    PanelModule,
    MegaMenuModule,
    MenubarModule,
    TieredMenuModule,
    TabMenuModule,
    DashBoardEntityModule,
    AutoCompleteModule,
    MatAutocompleteModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    AccordionModule,
    RatingModule,
    CalendarModule,
    ButtonModule,
    CardModule,
    PanelModule,
    MegaMenuModule,
    MenubarModule,
    TieredMenuModule,
    TabMenuModule,
    DashBoardEntityModule,
    AutoCompleteModule,
    MatAutocompleteModule,
  ],
  declarations: [SharedComponent]
})
export class SharedModule { }
