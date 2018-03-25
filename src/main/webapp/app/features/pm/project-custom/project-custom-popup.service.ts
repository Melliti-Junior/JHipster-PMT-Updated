import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCustom } from './project-custom.model';
import { ProjectCustomService } from './project-custom.service';

@Injectable()
export class ProjectCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private projectcustomService: ProjectCustomService

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
                this.projectcustomService.find(id).subscribe((projectcustom) => {
                    if (projectcustom.startDate) {
                        projectcustom.startDate = {
                            year: projectcustom.startDate.getFullYear(),
                            month: projectcustom.startDate.getMonth() + 1,
                            day: projectcustom.startDate.getDate()
                        };
                    }
                    if (projectcustom.endDate) {
                        projectcustom.endDate = {
                            year: projectcustom.endDate.getFullYear(),
                            month: projectcustom.endDate.getMonth() + 1,
                            day: projectcustom.endDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.projectcustomModalRef(component, projectcustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.projectcustomModalRef(component, new ProjectCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    projectcustomModalRef(component: Component, projectcustom: ProjectCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.projectcustom = projectcustom;
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
