/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { TransitionComponent } from '../../../../../../main/webapp/app/entities/transition/transition.component';
import { TransitionService } from '../../../../../../main/webapp/app/entities/transition/transition.service';
import { Transition } from '../../../../../../main/webapp/app/entities/transition/transition.model';

describe('Component Tests', () => {

    describe('Transition Management Component', () => {
        let comp: TransitionComponent;
        let fixture: ComponentFixture<TransitionComponent>;
        let service: TransitionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [TransitionComponent],
                providers: [
                    TransitionService
                ]
            })
            .overrideTemplate(TransitionComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TransitionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TransitionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Transition('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.transitions[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
