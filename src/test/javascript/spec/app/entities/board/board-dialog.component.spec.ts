/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { DashBoardTestModule } from '../../../test.module';
import { BoardDialogComponent } from '../../../../../../main/webapp/app/entities/board/board-dialog.component';
import { BoardService } from '../../../../../../main/webapp/app/entities/board/board.service';
import { Board } from '../../../../../../main/webapp/app/entities/board/board.model';

describe('Component Tests', () => {

    describe('Board Management Dialog Component', () => {
        let comp: BoardDialogComponent;
        let fixture: ComponentFixture<BoardDialogComponent>;
        let service: BoardService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [BoardDialogComponent],
                providers: [
                    BoardService
                ]
            })
            .overrideTemplate(BoardDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BoardDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BoardService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Board('123');
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.board = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'boardListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Board();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.board = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'boardListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
