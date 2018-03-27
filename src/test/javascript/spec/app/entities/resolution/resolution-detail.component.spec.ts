/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { ResolutionDetailComponent } from '../../../../../../main/webapp/app/entities/resolution/resolution-detail.component';
import { ResolutionService } from '../../../../../../main/webapp/app/entities/resolution/resolution.service';
import { Resolution } from '../../../../../../main/webapp/app/entities/resolution/resolution.model';

describe('Component Tests', () => {

    describe('Resolution Management Detail Component', () => {
        let comp: ResolutionDetailComponent;
        let fixture: ComponentFixture<ResolutionDetailComponent>;
        let service: ResolutionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [ResolutionDetailComponent],
                providers: [
                    ResolutionService
                ]
            })
            .overrideTemplate(ResolutionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResolutionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResolutionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Resolution('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.resolution).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
