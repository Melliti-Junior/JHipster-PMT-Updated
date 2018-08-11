import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SprintCustom} from './sprint-custom.model';
import {SprintCustomService} from './sprint-custom.service';

@Injectable()
export class SprintCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private sprintcustomService: SprintCustomService

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
                this.sprintcustomService.find(id).subscribe((sprintcustom) => {
                    if (sprintcustom.startDate) {
                        sprintcustom.startDate = {
                            year: sprintcustom.startDate.getFullYear(),
                            month: sprintcustom.startDate.getMonth() + 1,
                            day: sprintcustom.startDate.getDate()
                        };
                    }
                    if (sprintcustom.endDate) {
                        sprintcustom.endDate = {
                            year: sprintcustom.endDate.getFullYear(),
                            month: sprintcustom.endDate.getMonth() + 1,
                            day: sprintcustom.endDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.sprintcustomModalRef(component, sprintcustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorsprint
                setTimeout(() => {
                    this.ngbModalRef = this.sprintcustomModalRef(component, new SprintCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    /*
    validate(id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.sprintcustomService.find(id).subscribe((sprintcustom) => {
                    if (sprintcustom.startDate) {
                        sprintcustom.startDate = {
                            year: sprintcustom.startDate.getFullYear(),
                            month: sprintcustom.startDate.getMonth() + 1,
                            day: sprintcustom.startDate.getDate()
                        };
                    }
                    if (sprintcustom.endDate) {
                        sprintcustom.endDate = {
                            year: sprintcustom.endDate.getFullYear(),
                            month: sprintcustom.endDate.getMonth() + 1,
                            day: sprintcustom.endDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.sprintcustomModalRef(component, sprintcustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorsprint
                setTimeout(() => {
                    this.ngbModalRef = this.sprintcustomModalRef(component, new CustomSprint());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }
*/
    sprintcustomModalRef(component: Component, sprintcustom: SprintCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.sprintcustom = sprintcustom;
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
