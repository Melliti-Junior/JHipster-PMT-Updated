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

@Component({
    selector: 'jhi-board-custom-configuration',
    templateUrl: './board-custom-configuration.component.html',
    styleUrls: ['./board-custom-configuration.component.css']
})
export class BoardCustomConfigurationComponent implements OnInit, OnDestroy {

    boardcustom: BoardCustom;
    allColumns: ColumnCustom[];
    allStatuses: Status[];
    relatedColumns: ColumnCustom[];
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomService: BoardCustomService,
        private columncustomService: ColumnCustomService,
        private statusService: StatusService,
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
        this.statusService.getStatuses()
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
    }

}
