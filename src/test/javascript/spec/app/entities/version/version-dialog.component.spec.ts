/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { VersionDialogComponent } from '../../../../../../main/webapp/app/entities/version/version-dialog.component';
import { VersionService } from '../../../../../../main/webapp/app/entities/version/version.service';
import { Version } from '../../../../../../main/webapp/app/entities/version/version.model';

describe('Component Tests', () => {

    describe('Version Management Dialog Component', () => {
        let comp: VersionDialogComponent;
        let fixture: ComponentFixture<VersionDialogComponent>;
        let service: VersionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [VersionDialogComponent],
                providers: [
                    VersionService
                ]
            })
            .overrideTemplate(VersionDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(VersionDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VersionService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Version('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.version = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'versionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Version();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.version = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'versionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
