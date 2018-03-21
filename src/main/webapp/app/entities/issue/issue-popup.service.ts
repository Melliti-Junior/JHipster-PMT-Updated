import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Issue } from './issue.model';
import { IssueService } from './issue.service';

@Injectable()
export class IssuePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private issueService: IssueService

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
                this.issueService.find(id).subscribe((issue) => {
                    if (issue.createdDate) {
                        issue.createdDate = {
                            year: issue.createdDate.getFullYear(),
                            month: issue.createdDate.getMonth() + 1,
                            day: issue.createdDate.getDate()
                        };
                    }
                    if (issue.dueDate) {
                        issue.dueDate = {
                            year: issue.dueDate.getFullYear(),
                            month: issue.dueDate.getMonth() + 1,
                            day: issue.dueDate.getDate()
                        };
                    }
                    if (issue.updatedDate) {
                        issue.updatedDate = {
                            year: issue.updatedDate.getFullYear(),
                            month: issue.updatedDate.getMonth() + 1,
                            day: issue.updatedDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.issueModalRef(component, issue);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.issueModalRef(component, new Issue());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    issueModalRef(component: Component, issue: Issue): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.issue = issue;
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
