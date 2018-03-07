/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { IssueTypeDetailComponent } from '../../../../../../main/webapp/app/entities/issue-type/issue-type-detail.component';
import { IssueTypeService } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.service';
import { IssueType } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.model';

describe('Component Tests', () => {

    describe('IssueType Management Detail Component', () => {
        let comp: IssueTypeDetailComponent;
        let fixture: ComponentFixture<IssueTypeDetailComponent>;
        let service: IssueTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssueTypeDetailComponent],
                providers: [
                    IssueTypeService
                ]
            })
            .overrideTemplate(IssueTypeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssueTypeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssueTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new IssueType('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.issueType).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
