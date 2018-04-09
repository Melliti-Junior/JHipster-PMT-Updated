/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { SprintComponent } from '../../../../../../main/webapp/app/entities/sprint/sprint.component';
import { SprintService } from '../../../../../../main/webapp/app/entities/sprint/sprint.service';
import { Sprint } from '../../../../../../main/webapp/app/entities/sprint/sprint.model';

describe('Component Tests', () => {

    describe('Sprint Management Component', () => {
        let comp: SprintComponent;
        let fixture: ComponentFixture<SprintComponent>;
        let service: SprintService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [SprintComponent],
                providers: [
                    SprintService
                ]
            })
            .overrideTemplate(SprintComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SprintComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SprintService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Sprint('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.sprints[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
