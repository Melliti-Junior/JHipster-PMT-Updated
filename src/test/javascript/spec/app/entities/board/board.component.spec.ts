/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { BoardComponent } from '../../../../../../main/webapp/app/entities/board/board.component';
import { BoardService } from '../../../../../../main/webapp/app/entities/board/board.service';
import { Board } from '../../../../../../main/webapp/app/entities/board/board.model';

describe('Component Tests', () => {

    describe('Board Management Component', () => {
        let comp: BoardComponent;
        let fixture: ComponentFixture<BoardComponent>;
        let service: BoardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [BoardComponent],
                providers: [
                    BoardService
                ]
            })
            .overrideTemplate(BoardComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BoardComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BoardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Board('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.boards[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
