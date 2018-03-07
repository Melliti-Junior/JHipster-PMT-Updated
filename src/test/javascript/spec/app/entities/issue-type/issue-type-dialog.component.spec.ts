/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { IssueTypeDialogComponent } from '../../../../../../main/webapp/app/entities/issue-type/issue-type-dialog.component';
import { IssueTypeService } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.service';
import { IssueType } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.model';

describe('Component Tests', () => {

    describe('IssueType Management Dialog Component', () => {
        let comp: IssueTypeDialogComponent;
        let fixture: ComponentFixture<IssueTypeDialogComponent>;
        let service: IssueTypeService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssueTypeDialogComponent],
                providers: [
                    IssueTypeService
                ]
            })
            .overrideTemplate(IssueTypeDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssueTypeDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssueTypeService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new IssueType('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.issueType = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'issueTypeListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new IssueType();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.issueType = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'issueTypeListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
