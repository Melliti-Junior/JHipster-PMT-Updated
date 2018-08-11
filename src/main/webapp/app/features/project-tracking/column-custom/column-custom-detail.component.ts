import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {ColumnCustom} from './column-custom.model';
import {ColumnCustomService} from './column-custom.service';
import {IssueCustom} from '../issue-custom';
import {IssueCustomService} from '../issue-custom/issue-custom.service';

@Component({
    selector: 'jhi-column-custom-detail',
    templateUrl: './column-custom-detail.component.html',
    styleUrls: ['./column-custom-detail.component.css']
})
export class ColumnCustomDetailComponent implements OnInit, OnDestroy, AfterViewInit {

    columncustom: ColumnCustom;
    issueCustoms: IssueCustom[] = new Array<IssueCustom>();
    relatedissuecustoms: IssueCustom[] = new Array<IssueCustom>();

    chosenIssues: IssueCustom[] = new Array<IssueCustom>();

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private columncustomSce: ColumnCustomService,
        private route: ActivatedRoute,
        private issuecustomSce: IssueCustomService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInColumnCustoms();
        this.loadAttributes();
        // this.getBoardIssues();
    }

    ngAfterViewInit() {
        console.log('finish');
        // let BacklogBtnID = document.getElementById('backlog').click();
    }

    load(id) {
        this.columncustomSce.find(id).subscribe((columncustom) => {
            this.columncustom = columncustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInColumnCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'columncustomListModification',
            (response) => this.load(this.columncustom.id)
        );
    }

    private loadAttributes() {
        this.issuecustomSce.getIssueCustoms()
            .then((issueCustoms) => this.issueCustoms = issueCustoms );
        // this.getBoardIssues();
        console.log('Total : ' + this.issueCustoms.length);
    }

    dragStart(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
        console.log(ev.target.id);
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    drop(ev) {
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
        // console.log(document.getElementById(data).id);

        for (let issue of this.issueCustoms) {
            if (issue.id === document.getElementById(data).id) {
                this.chosenIssues.push(issue);
                console.log(issue.code);
                console.log(this.chosenIssues.length);
            }
        }

        /*
        // Return the elt by ID and use it to add it to the selected Issues
        let x = this.issuecustomSce.find(document.getElementById(data).id);

        console.log('before ' + this.chosenIssues.length);

        // let issue: CustomIssue;
        // this.chosenIssues.push(issue);

        this.issuecustomSce.find(document.getElementById(data).id)
            .subscribe((res) => this.chosenIssues.push(res));

        console.log('after ' + this.chosenIssues.length);

        for (let index = 0; index < this.chosenIssues.length; index++) {
            console.log(this.chosenIssues[index].code);
        }
        */
    }

}
