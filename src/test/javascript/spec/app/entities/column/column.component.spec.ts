/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { DashBoardTestModule } from '../../../test.module';
import { ColumnComponent } from '../../../../../../main/webapp/app/entities/column/column.component';
import { ColumnService } from '../../../../../../main/webapp/app/entities/column/column.service';
import { Column } from '../../../../../../main/webapp/app/entities/column/column.model';

describe('Component Tests', () => {

    describe('Column Management Component', () => {
        let comp: ColumnComponent;
        let fixture: ComponentFixture<ColumnComponent>;
        let service: ColumnService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [DashBoardTestModule],
                declarations: [ColumnComponent],
                providers: [
                    ColumnService
                ]
            })
            .overrideTemplate(ColumnComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ColumnComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ColumnService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Column('123')],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.columns[0]).toEqual(jasmine.objectContaining({id: '123'}));
            });
        });
    });

});
