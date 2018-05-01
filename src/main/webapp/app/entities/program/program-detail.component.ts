import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Program } from './program.model';
import { ProgramService } from './program.service';
import {ProjectCustom, ProjectCustomService} from '../../features/pm/project-custom';
import {ResponseWrapper} from '../../shared';

@Component({
    selector: 'jhi-program-detail',
    templateUrl: './program-detail.component.html'
})
export class ProgramDetailComponent implements OnInit, OnDestroy {

    program: Program;
    projectcustoms: ProjectCustom[];
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private programService: ProgramService,
        private projectSce: ProjectCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPrograms();
        setTimeout(() => {
            this.getRelatedProjects();
        }, 200);
    }

    load(id) {
        this.programService.find(id).subscribe((program) => {
            this.program = program;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPrograms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'programListModification',
            (response) => this.load(this.program.id)
        );
    }

    getRelatedProjects() {
        /*
        this.projectSce.getProjects()
            .then((projects) => this.projectcustoms = projects );
*/

        if (this.program) {
            this.projectSce.search({query : this.program.id})
                .subscribe(
                    (res: ResponseWrapper) => this.retrieveRelatedProjects(res.json),
                    (error) => console.log(error));
        }
    }

    retrieveRelatedProjects(data) {
        this.projectcustoms = data;
    }
}
