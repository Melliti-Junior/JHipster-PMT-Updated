/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { EpicComponent } from '../../../../../../main/webapp/app/entities/epic/epic.component';
import { EpicService } from '../../../../../../main/webapp/app/entities/epic/epic.service';
import { Epic } from '../../../../../../main/webapp/app/entities/epic/epic.model';

describe('Component Tests', () => {

    describe('Epic Management Component', () => {
        let comp: EpicComponent;
        let fixture: ComponentFixture<EpicComponent>;
        let service: EpicService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [EpicComponent],
                providers: [
                    EpicService
                ]
            })
            .overrideTemplate(EpicComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EpicComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EpicService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Epic('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.epics[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
