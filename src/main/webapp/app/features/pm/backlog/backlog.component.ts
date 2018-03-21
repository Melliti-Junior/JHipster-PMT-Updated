import { Component, OnInit } from '@angular/core';
import { IssueCustomService } from '../issue-custom/issue-custom.service';
import { IssueCustom } from '../issue-custom';

@Component({
  selector: 'jhi-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

    issues: IssueCustom[];
    logoPath: string;
  constructor(private issuecustomSce: IssueCustomService) { }

  ngOnInit() {
      this.getAllIssues();
      this.logoPath = '../../../../content/images';
  }

  getAllIssues() {
    this.issuecustomSce.getIssueCustoms()
    .then((issues) => this.issues = issues );
  }

}
