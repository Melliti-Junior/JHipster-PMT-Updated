/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { TransitionDetailComponent } from '../../../../../../main/webapp/app/entities/transition/transition-detail.component';
import { TransitionService } from '../../../../../../main/webapp/app/entities/transition/transition.service';
import { Transition } from '../../../../../../main/webapp/app/entities/transition/transition.model';

describe('Component Tests', () => {

    describe('Transition Management Detail Component', () => {
        let comp: TransitionDetailComponent;
        let fixture: ComponentFixture<TransitionDetailComponent>;
        let service: TransitionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [TransitionDetailComponent],
                providers: [
                    TransitionService
                ]
            })
            .overrideTemplate(TransitionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TransitionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TransitionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Transition('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.transition).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
