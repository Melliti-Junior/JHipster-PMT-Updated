/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { StepDetailComponent } from '../../../../../../main/webapp/app/entities/step/step-detail.component';
import { StepService } from '../../../../../../main/webapp/app/entities/step/step.service';
import { Step } from '../../../../../../main/webapp/app/entities/step/step.model';

describe('Component Tests', () => {

    describe('Step Management Detail Component', () => {
        let comp: StepDetailComponent;
        let fixture: ComponentFixture<StepDetailComponent>;
        let service: StepService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [StepDetailComponent],
                providers: [
                    StepService
                ]
            })
            .overrideTemplate(StepDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StepDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StepService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Step('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.step).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
