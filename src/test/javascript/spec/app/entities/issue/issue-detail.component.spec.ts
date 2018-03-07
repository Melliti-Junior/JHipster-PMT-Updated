/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { IssueDetailComponent } from '../../../../../../main/webapp/app/entities/issue/issue-detail.component';
import { IssueService } from '../../../../../../main/webapp/app/entities/issue/issue.service';
import { Issue } from '../../../../../../main/webapp/app/entities/issue/issue.model';

describe('Component Tests', () => {

    describe('Issue Management Detail Component', () => {
        let comp: IssueDetailComponent;
        let fixture: ComponentFixture<IssueDetailComponent>;
        let service: IssueService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssueDetailComponent],
                providers: [
                    IssueService
                ]
            })
            .overrideTemplate(IssueDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssueDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssueService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Issue('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.issue).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
