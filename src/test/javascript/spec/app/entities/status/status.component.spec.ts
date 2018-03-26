/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { StatusComponent } from '../../../../../../main/webapp/app/entities/status/status.component';
import { StatusService } from '../../../../../../main/webapp/app/entities/status/status.service';
import { Status } from '../../../../../../main/webapp/app/entities/status/status.model';

describe('Component Tests', () => {

    describe('Status Management Component', () => {
        let comp: StatusComponent;
        let fixture: ComponentFixture<StatusComponent>;
        let service: StatusService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [StatusComponent],
                providers: [
                    StatusService
                ]
            })
            .overrideTemplate(StatusComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StatusComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StatusService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Status('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.statuses[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
