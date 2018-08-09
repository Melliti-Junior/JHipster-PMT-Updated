import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {SprintCustom} from './sprint-custom.model';
import {SprintCustomService} from './sprint-custom.service';
import {ITEMS_PER_PAGE, Principal, ResponseWrapper} from '../../../shared';

@Component({
    selector: 'jhi-sprint-custom',
    templateUrl: './sprint-custom.component.html'
})
export class SprintCustomComponent implements OnInit, OnDestroy {

currentAccount: any;
    sprintcustoms: SprintCustom[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private sprintcustomService: SprintCustomService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.sprintcustomService.search({
                page: this.page - 1,
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                    (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
        }
        this.sprintcustomService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/sprintcustoms'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    /**
     *
     * @param {SprintCustom} sprint
     * This function is used to make sure that
     * only one sprint is active for every board
     * at the same time
     */
    activateOnlyCurrentSprint(sprint: SprintCustom) {
        sprint.isActive = true;

        console.log(sprint.id);
        console.log(sprint.code);
        console.log(sprint.board.name);
        console.log(sprint.isActive);
        console.log(sprint.name);
        console.log(sprint.startDate + ' start');
        console.log(sprint.endDate + ' end');
        this.sprintcustomService.update(sprint);

        for (let sp of this.sprintcustoms) {
            if (sp.board.name === sprint.board.name) {
                if (sp.id !== sprint.id) {
                    sp.isActive = false;
                }
            }
        }
        console.log(sprint.id + 'is active : ' + sprint.isActive)
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/sprintcustoms', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate(['/sprintcustoms', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSprintCustoms();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SprintCustom) {
        return item.id;
    }
    registerChangeInSprintCustoms() {
        this.eventSubscriber = this.eventManager.subscribe('sprintcustomsListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.sprintcustoms = data;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    previousState() {
        window.history.back();
    }
}
