/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { BoardDetailComponent } from '../../../../../../main/webapp/app/entities/board/board-detail.component';
import { BoardService } from '../../../../../../main/webapp/app/entities/board/board.service';
import { Board } from '../../../../../../main/webapp/app/entities/board/board.model';

describe('Component Tests', () => {

    describe('Board Management Detail Component', () => {
        let comp: BoardDetailComponent;
        let fixture: ComponentFixture<BoardDetailComponent>;
        let service: BoardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [BoardDetailComponent],
                providers: [
                    BoardService
                ]
            })
            .overrideTemplate(BoardDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BoardDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BoardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Board('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.board).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
