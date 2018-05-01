/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { WorkflowComponent } from '../../../../../../main/webapp/app/entities/workflow/workflow.component';
import { WorkflowService } from '../../../../../../main/webapp/app/entities/workflow/workflow.service';
import { Workflow } from '../../../../../../main/webapp/app/entities/workflow/workflow.model';

describe('Component Tests', () => {

    describe('Workflow Management Component', () => {
        let comp: WorkflowComponent;
        let fixture: ComponentFixture<WorkflowComponent>;
        let service: WorkflowService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [WorkflowComponent],
                providers: [
                    WorkflowService
                ]
            })
            .overrideTemplate(WorkflowComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WorkflowComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WorkflowService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Workflow('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.workflows[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
