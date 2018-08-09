import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {IssueCustom} from './issue-custom.model';
import {IssueCustomService} from './issue-custom.service';

@Injectable()
export class IssueCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private issuecustomService: IssueCustomService,
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
                this.issuecustomService.find(id).subscribe((issuecustom) => {
                    if (issuecustom.createdDate) {
                        issuecustom.createdDate = {
                            year: issuecustom.createdDate.getFullYear(),
                            month: issuecustom.createdDate.getMonth() + 1,
                            day: issuecustom.createdDate.getDate()
                        };
                    }
                    if (issuecustom.updatedDate) {
                        issuecustom.updatedDate = {
                            year: issuecustom.updatedDate.getFullYear(),
                            month: issuecustom.updatedDate.getMonth() + 1,
                            day: issuecustom.updatedDate.getDate()
                        };
                    }
                    if (issuecustom.dueDate) {
                        issuecustom.dueDate = {
                            year: issuecustom.dueDate.getFullYear(),
                            month: issuecustom.dueDate.getMonth() + 1,
                            day: issuecustom.dueDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.issuecustomModalRef(component, issuecustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorissue
                setTimeout(() => {
                    this.ngbModalRef = this.issuecustomModalRef(component, new IssueCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    issuecustomModalRef(component: Component, issuecustom: IssueCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.issuecustom = issuecustom;
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
