/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { IssuePriorityDetailComponent } from '../../../../../../main/webapp/app/entities/issue-priority/issue-priority-detail.component';
import { IssuePriorityService } from '../../../../../../main/webapp/app/entities/issue-priority/issue-priority.service';
import { IssuePriority } from '../../../../../../main/webapp/app/entities/issue-priority/issue-priority.model';

describe('Component Tests', () => {

    describe('IssuePriority Management Detail Component', () => {
        let comp: IssuePriorityDetailComponent;
        let fixture: ComponentFixture<IssuePriorityDetailComponent>;
        let service: IssuePriorityService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssuePriorityDetailComponent],
                providers: [
                    IssuePriorityService
                ]
            })
            .overrideTemplate(IssuePriorityDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssuePriorityDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssuePriorityService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new IssuePriority('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.issuePriority).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
