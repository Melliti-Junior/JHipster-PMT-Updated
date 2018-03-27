/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { ResolutionDialogComponent } from '../../../../../../main/webapp/app/entities/resolution/resolution-dialog.component';
import { ResolutionService } from '../../../../../../main/webapp/app/entities/resolution/resolution.service';
import { Resolution } from '../../../../../../main/webapp/app/entities/resolution/resolution.model';

describe('Component Tests', () => {

    describe('Resolution Management Dialog Component', () => {
        let comp: ResolutionDialogComponent;
        let fixture: ComponentFixture<ResolutionDialogComponent>;
        let service: ResolutionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [ResolutionDialogComponent],
                providers: [
                    ResolutionService
                ]
            })
            .overrideTemplate(ResolutionDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResolutionDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResolutionService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Resolution('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.resolution = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'resolutionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Resolution();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.resolution = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'resolutionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
