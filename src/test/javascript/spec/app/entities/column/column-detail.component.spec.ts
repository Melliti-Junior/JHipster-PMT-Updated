/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { DashBoardTestModule } from '../../../test.module';
import { ColumnDetailComponent } from '../../../../../../main/webapp/app/entities/column/column-detail.component';
import { ColumnService } from '../../../../../../main/webapp/app/entities/column/column.service';
import { Column } from '../../../../../../main/webapp/app/entities/column/column.model';

describe('Component Tests', () => {

    describe('Column Management Detail Component', () => {
        let comp: ColumnDetailComponent;
        let fixture: ComponentFixture<ColumnDetailComponent>;
        let service: ColumnService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [ColumnDetailComponent],
                providers: [
                    ColumnService
                ]
            })
            .overrideTemplate(ColumnDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ColumnDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ColumnService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Column('123')));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith('123');
                expect(comp.column).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
