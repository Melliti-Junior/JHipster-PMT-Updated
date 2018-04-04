/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { VersionDetailComponent } from '../../../../../../main/webapp/app/entities/version/version-detail.component';
import { VersionService } from '../../../../../../main/webapp/app/entities/version/version.service';
import { Version } from '../../../../../../main/webapp/app/entities/version/version.model';

describe('Component Tests', () => {

    describe('Version Management Detail Component', () => {
        let comp: VersionDetailComponent;
        let fixture: ComponentFixture<VersionDetailComponent>;
        let service: VersionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [VersionDetailComponent],
                providers: [
                    VersionService
                ]
            })
            .overrideTemplate(VersionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(VersionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VersionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Version('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.version).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
