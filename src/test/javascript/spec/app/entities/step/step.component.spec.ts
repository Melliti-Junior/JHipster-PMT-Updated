/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { StepComponent } from '../../../../../../main/webapp/app/entities/step/step.component';
import { StepService } from '../../../../../../main/webapp/app/entities/step/step.service';
import { Step } from '../../../../../../main/webapp/app/entities/step/step.model';

describe('Component Tests', () => {

    describe('Step Management Component', () => {
        let comp: StepComponent;
        let fixture: ComponentFixture<StepComponent>;
        let service: StepService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [StepComponent],
                providers: [
                    StepService
                ]
            })
            .overrideTemplate(StepComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StepComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StepService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Step('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.steps[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
