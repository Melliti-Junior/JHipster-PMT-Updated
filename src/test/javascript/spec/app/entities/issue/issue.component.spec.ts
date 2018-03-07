/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { IssueComponent } from '../../../../../../main/webapp/app/entities/issue/issue.component';
import { IssueService } from '../../../../../../main/webapp/app/entities/issue/issue.service';
import { Issue } from '../../../../../../main/webapp/app/entities/issue/issue.model';

describe('Component Tests', () => {

    describe('Issue Management Component', () => {
        let comp: IssueComponent;
        let fixture: ComponentFixture<IssueComponent>;
        let service: IssueService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [IssueComponent],
                providers: [
                    IssueService
                ]
            })
            .overrideTemplate(IssueComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IssueComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IssueService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Issue('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.issues[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
