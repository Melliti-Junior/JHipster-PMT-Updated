/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { IssuePriorityComponent } from '../../../../../../main/webapp/app/entities/issue-priority/issue-priority.component';
import { IssuePriorityService } from '../../../../../../main/webapp/app/entities/issue-priority/issue-priority.service';
import { IssuePriority } from '../../../../../../main/webapp/app/entities/issue-priority/issue-priority.model';

describe('Component Tests', () => {

    describe('IssuePriority Management Component', () => {
        let comp: IssuePriorityComponent;
        let fixture: ComponentFixture<IssuePriorityComponent>;
        let service: IssuePriorityService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssuePriorityComponent],
                providers: [
                    IssuePriorityService
                ]
            })
            .overrideTemplate(IssuePriorityComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssuePriorityComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssuePriorityService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new IssuePriority('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.issuePriorities[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
