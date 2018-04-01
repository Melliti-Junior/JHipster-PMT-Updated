import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BoardCustom } from './board-custom.model';
import { BoardCustomService } from './board-custom.service';

@Injectable()
export class BoardCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private boardcustomService: BoardCustomService

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
                this.boardcustomService.find(id).subscribe((boardcustom) => {
                    this.ngbModalRef = this.boardcustomModalRef(component, boardcustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorboard
                setTimeout(() => {
                    this.ngbModalRef = this.boardcustomModalRef(component, new BoardCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    boardcustomModalRef(component: Component, boardcustom: BoardCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.boardcustom = boardcustom;
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
