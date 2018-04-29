import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';
import {ColumnCustom} from '../column-custom/column-custom.model';
import {ColumnCustomService} from '../column-custom/column-custom.service';
import {BoardCustom} from './board-custom.model';
import {BoardCustomService} from './board-custom.service';
import {ResponseWrapper} from '../../../shared';
import {Status, StatusService} from '../../../entities/status';
import {StatusCustom, StatusCustomService} from "../status-custom";
import {Observable} from "rxjs/Observable";
import {IssueCustom} from "../issue-custom";
import {Response} from "@angular/http";

@Component({
    selector: 'jhi-board-custom-configuration',
    templateUrl: './board-custom-configuration.component.html',
    styleUrls: ['./board-custom-configuration.component.css']
})
export class BoardCustomConfigurationComponent implements OnInit, OnDestroy {

    boardcustom: BoardCustom;
    allColumns: ColumnCustom[];
    allStatuses: StatusCustom[];
    relatedColumns: ColumnCustom[];
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    isSaving: boolean;

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomService: BoardCustomService,
        private columncustomService: ColumnCustomService,
        private statusService: StatusCustomService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        // this.relatedColumns = new Array<ColumnCustom>();
        this.allColumns = new Array<ColumnCustom>();

        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBoardCustoms();
        this.loadAttributes();
    }

    load(id) {
        this.boardcustomService.find(id).subscribe((boardcustom) => {
            this.boardcustom = boardcustom;
        });
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBoardCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'boardcustomListModification',
            (response) => this.load(this.boardcustom.id)
        );
    }

    searchRelatedColumns() {
        this.relatedColumns = new Array<ColumnCustom>();
        for (let col of this.allColumns) {
            console.log('col id' + col.board.code)
            console.log('board id' + this.boardcustom.code)
            if (col.board.code.toLowerCase() === this.boardcustom.code.toLowerCase()) {
                if (this.relatedColumns.indexOf(col) === -1) {
                    this.relatedColumns.push(col);
                }
            }
        }
        console.log(this.relatedColumns.length)
    }

    loadAttributes() {
        this.columncustomService.getColumnCustoms()
            .then((allColumns) => this.allColumns = allColumns );
        this.statusService.getStatusCustoms()
            .then((allStatuses) => this.allStatuses = allStatuses);
    }

    dragStart(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    dragend(ev) {
        console.error('dragend starts here');

        let data = ev.dataTransfer.getData('text');

        console.error('dragend stops here');

    }

    drop(ev) {
        console.error('dropev starts here')
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));

        console.log('hello source ' + document.getElementById(data).id);

        console.log('hello target ' + ev.target.id);

        let comingStatus = this.findDraggedStatus(document.getElementById(data).id);
        console.log(' heyyyy stats ' + comingStatus.name)

        if (ev.target.id === 'unmappedStatus') {
            console.log('unmapped')
            this.unmapStatus(comingStatus);
            document.getElementById(data).hidden = true;
        } else {
            let currentColumn = this.findCurrentColumn(ev);
            console.log(' oppaa  coll ' + currentColumn.name)

            this.mapStatusToCol(comingStatus, currentColumn);
        }
    }

    findCurrentColumn(ev): ColumnCustom {
        let found = false;
        let index = 0;
        let currentCol = new ColumnCustom()
        while ((found === false) && (index <= this.allColumns.length)) {
            if (this.allColumns[index].id === ev.target.id) {
                found = true;
                currentCol = this.allColumns[index];
            } else {
                index = index + 1;
            }
        }
        return currentCol;
    }

    findDraggedStatus(id): StatusCustom {
        let found = false;
        let index = 0;
        let draggedStat = new StatusCustom()
        while ((found === false) && (index <= this.allStatuses.length)) {
            if (this.allStatuses[index].id === id) {
                found = true;
                draggedStat = this.allStatuses[index];
            } else {
                index = index + 1;
            }
        }
        return draggedStat;
    }

    mapStatusToCol(status: StatusCustom, col: ColumnCustom) {
        status.column = col;

        this.isSaving = true;
        this.subscribeToSaveResponseStats(
            this.statusService.update(status));

        console.log('update ' + status.name + ' with col ' + status.column.name);
    }

    unmapStatus(status: StatusCustom) {
        status.column = null;

        this.isSaving = true;
        this.subscribeToSaveResponseStats(
            this.statusService.update(status));

        console.log('update ' + status.name + ' with col ' + typeof status.column);
    }

    getStatusPerColumn(col: ColumnCustom): StatusCustom[] {
        let relatedStatuses = new Array<StatusCustom>();
        for (let st of this.allStatuses) {
            if (st.column.id === col.id) {
                if (relatedStatuses.indexOf(st) === -1) {
                    relatedStatuses.push(st)
                }
            }
        }
        return relatedStatuses;
    }

    private subscribeToSaveResponseStats(result: Observable<StatusCustom>) {
        result.subscribe((res: StatusCustom) =>
            this.onSaveSuccessStatus(res), (res: Response) => this.onSaveError());
    }


    private onSaveSuccessStatus(result: IssueCustom) {
        this.eventManager.broadcast({ name: 'statuscustomsListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
