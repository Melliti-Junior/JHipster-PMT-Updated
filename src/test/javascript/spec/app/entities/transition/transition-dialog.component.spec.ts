/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { TransitionDialogComponent } from '../../../../../../main/webapp/app/entities/transition/transition-dialog.component';
import { TransitionService } from '../../../../../../main/webapp/app/entities/transition/transition.service';
import { Transition } from '../../../../../../main/webapp/app/entities/transition/transition.model';

describe('Component Tests', () => {

    describe('Transition Management Dialog Component', () => {
        let comp: TransitionDialogComponent;
        let fixture: ComponentFixture<TransitionDialogComponent>;
        let service: TransitionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [TransitionDialogComponent],
                providers: [
                    TransitionService
                ]
            })
            .overrideTemplate(TransitionDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TransitionDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TransitionService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Transition('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.transition = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'transitionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Transition();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.transition = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'transitionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
