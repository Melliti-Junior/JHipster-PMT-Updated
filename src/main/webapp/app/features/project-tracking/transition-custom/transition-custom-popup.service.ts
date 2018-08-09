import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TransitionCustom} from './transition-custom.model';
import {TransitionCustomService} from './transition-custom.service';

@Injectable()
export class TransitionCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private transitioncustomService: TransitionCustomService

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
                this.transitioncustomService.find(id).subscribe((transitioncustom) => {
                    this.ngbModalRef = this.transitioncustomModalRef(component, transitioncustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrortransition
                setTimeout(() => {
                    this.ngbModalRef = this.transitioncustomModalRef(component, new TransitionCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    transitioncustomModalRef(component: Component, transitioncustom: TransitionCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.transitioncustom = transitioncustom;
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
