import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ResolutionCustom} from './resolution-custom.model';
import {ResolutionCustomService} from './resolution-custom.service';

@Injectable()
export class ResolutionCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private resolutioncustomService: ResolutionCustomService

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
                this.resolutioncustomService.find(id).subscribe((resolutioncustom) => {
                    this.ngbModalRef = this.resolutioncustomModalRef(component, resolutioncustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorresolution
                setTimeout(() => {
                    this.ngbModalRef = this.resolutioncustomModalRef(component, new ResolutionCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    resolutioncustomModalRef(component: Component, resolutioncustom: ResolutionCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.resolutioncustom = resolutioncustom;
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
