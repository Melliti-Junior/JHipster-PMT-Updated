/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { EpicDialogComponent } from '../../../../../../main/webapp/app/entities/epic/epic-dialog.component';
import { EpicService } from '../../../../../../main/webapp/app/entities/epic/epic.service';
import { Epic } from '../../../../../../main/webapp/app/entities/epic/epic.model';

describe('Component Tests', () => {

    describe('Epic Management Dialog Component', () => {
        let comp: EpicDialogComponent;
        let fixture: ComponentFixture<EpicDialogComponent>;
        let service: EpicService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [EpicDialogComponent],
                providers: [
                    EpicService
                ]
            })
            .overrideTemplate(EpicDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EpicDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EpicService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Epic('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.epic = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'epicListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Epic();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.epic = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'epicListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
