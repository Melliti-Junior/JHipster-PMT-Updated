import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ngx-webstorage';

import { DashBoardSharedModule, UserRouteAccessService } from './shared';
import { DashBoardAppRoutingModule} from './app-routing.module';
import { DashBoardHomeModule } from './home/home.module';
import { DashBoardAdminModule } from './admin/admin.module';
import { DashBoardAccountModule } from './account/account.module';
import { DashBoardEntityModule } from './entities/entity.module';
import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { FeaturesModule } from './features/features.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { TieredMenuModule } from 'primeng/tieredmenu';

import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ErrorComponent
} from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        DashBoardAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        DashBoardSharedModule,
        DashBoardHomeModule,
        DashBoardAdminModule,
        DashBoardAccountModule,
        DashBoardEntityModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        FeaturesModule,
        TieredMenuModule
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class DashBoardAppModule {}
