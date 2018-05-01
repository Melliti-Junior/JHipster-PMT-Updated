/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { WorkflowDetailComponent } from '../../../../../../main/webapp/app/entities/workflow/workflow-detail.component';
import { WorkflowService } from '../../../../../../main/webapp/app/entities/workflow/workflow.service';
import { Workflow } from '../../../../../../main/webapp/app/entities/workflow/workflow.model';

describe('Component Tests', () => {

    describe('Workflow Management Detail Component', () => {
        let comp: WorkflowDetailComponent;
        let fixture: ComponentFixture<WorkflowDetailComponent>;
        let service: WorkflowService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [WorkflowDetailComponent],
                providers: [
                    WorkflowService
                ]
            })
            .overrideTemplate(WorkflowDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WorkflowDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WorkflowService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Workflow('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.workflow).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
