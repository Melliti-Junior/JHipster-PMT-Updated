import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ColumnCustom} from './column-custom.model';
import {ColumnCustomService} from './column-custom.service';

@Injectable()
export class ColumnCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private columncustomService: ColumnCustomService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.columncustomService.find(id).subscribe((columncustom) => {
                    this.ngbModalRef = this.columncustomModalRef(component, columncustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorcolumn
                setTimeout(() => {
                    this.ngbModalRef = this.columncustomModalRef(component, new ColumnCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    columncustomModalRef(component: Component, columncustom: ColumnCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.columncustom = columncustom;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
