import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {VersionCustom} from './version-custom.model';
import {VersionCustomService} from './version-custom.service';

@Injectable()
export class VersionCustomPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private versioncustomService: VersionCustomService

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
                this.versioncustomService.find(id).subscribe((versioncustom) => {
                    if (versioncustom.startDate) {
                        versioncustom.startDate = {
                            year: versioncustom.startDate.getFullYear(),
                            month: versioncustom.startDate.getMonth() + 1,
                            day: versioncustom.startDate.getDate()
                        };
                    }
                    if (versioncustom.releaseDate) {
                        versioncustom.releaseDate = {
                            year: versioncustom.releaseDate.getFullYear(),
                            month: versioncustom.releaseDate.getMonth() + 1,
                            day: versioncustom.releaseDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.versioncustomModalRef(component, versioncustom);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedErrorversion
                setTimeout(() => {
                    this.ngbModalRef = this.versioncustomModalRef(component, new VersionCustom());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    versioncustomModalRef(component: Component, versioncustom: VersionCustom): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.versioncustom = versioncustom;
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
