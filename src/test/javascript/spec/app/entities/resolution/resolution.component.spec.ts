/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { ResolutionComponent } from '../../../../../../main/webapp/app/entities/resolution/resolution.component';
import { ResolutionService } from '../../../../../../main/webapp/app/entities/resolution/resolution.service';
import { Resolution } from '../../../../../../main/webapp/app/entities/resolution/resolution.model';

describe('Component Tests', () => {

    describe('Resolution Management Component', () => {
        let comp: ResolutionComponent;
        let fixture: ComponentFixture<ResolutionComponent>;
        let service: ResolutionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [ResolutionComponent],
                providers: [
                    ResolutionService
                ]
            })
            .overrideTemplate(ResolutionComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ResolutionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ResolutionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Resolution('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.resolutions[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
