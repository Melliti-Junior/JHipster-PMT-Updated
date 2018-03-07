/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { IssueTypeComponent } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.component';
import { IssueTypeService } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.service';
import { IssueType } from '../../../../../../main/webapp/app/entities/issue-type/issue-type.model';

describe('Component Tests', () => {

    describe('IssueType Management Component', () => {
        let comp: IssueTypeComponent;
        let fixture: ComponentFixture<IssueTypeComponent>;
        let service: IssueTypeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssueTypeComponent],
                providers: [
                    IssueTypeService
                ]
            })
            .overrideTemplate(IssueTypeComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssueTypeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssueTypeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new IssueType('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.issueTypes[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
