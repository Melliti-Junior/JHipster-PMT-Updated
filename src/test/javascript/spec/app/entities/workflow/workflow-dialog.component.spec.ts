/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { WorkflowDialogComponent } from '../../../../../../main/webapp/app/entities/workflow/workflow-dialog.component';
import { WorkflowService } from '../../../../../../main/webapp/app/entities/workflow/workflow.service';
import { Workflow } from '../../../../../../main/webapp/app/entities/workflow/workflow.model';

describe('Component Tests', () => {

    describe('Workflow Management Dialog Component', () => {
        let comp: WorkflowDialogComponent;
        let fixture: ComponentFixture<WorkflowDialogComponent>;
        let service: WorkflowService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [WorkflowDialogComponent],
                providers: [
                    WorkflowService
                ]
            })
            .overrideTemplate(WorkflowDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WorkflowDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WorkflowService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Workflow('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.workflow = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'workflowListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Workflow();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.workflow = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'workflowListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
