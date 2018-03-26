/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { StatusDetailComponent } from '../../../../../../main/webapp/app/entities/status/status-detail.component';
import { StatusService } from '../../../../../../main/webapp/app/entities/status/status.service';
import { Status } from '../../../../../../main/webapp/app/entities/status/status.model';

describe('Component Tests', () => {

    describe('Status Management Detail Component', () => {
        let comp: StatusDetailComponent;
        let fixture: ComponentFixture<StatusDetailComponent>;
        let service: StatusService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [StatusDetailComponent],
                providers: [
                    StatusService
                ]
            })
            .overrideTemplate(StatusDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StatusDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StatusService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Status('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.status).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
