/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { EpicDetailComponent } from '../../../../../../main/webapp/app/entities/epic/epic-detail.component';
import { EpicService } from '../../../../../../main/webapp/app/entities/epic/epic.service';
import { Epic } from '../../../../../../main/webapp/app/entities/epic/epic.model';

describe('Component Tests', () => {

    describe('Epic Management Detail Component', () => {
        let comp: EpicDetailComponent;
        let fixture: ComponentFixture<EpicDetailComponent>;
        let service: EpicService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [EpicDetailComponent],
                providers: [
                    EpicService
                ]
            })
            .overrideTemplate(EpicDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EpicDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EpicService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Epic('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.epic).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
