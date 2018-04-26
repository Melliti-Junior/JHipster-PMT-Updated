import { Component, OnInit } from '@angular/core';
import { IssueCustomService } from '../issue-custom/issue-custom.service';
import { IssueCustom } from '../issue-custom';
import {ResponseWrapper} from '../../../shared';

@Component({
  selector: 'jhi-agile',
  templateUrl: './agile.component.html',
  styleUrls: ['./agile.component.css']
})
export class AgileComponent implements OnInit {

    issues: IssueCustom[];
    imgPath: string;

    cols: string[] = ['Open', 'Doing', 'Done'];
  constructor(private issuecustomSce: IssueCustomService) { }

  ngOnInit() {
      this.getAllIssues();
      this.imgPath = '../../../../content/images';

  }

  searchIssuesPerCol(col: string) {
      this.issuecustomSce.search({query : col})
          .subscribe(
              (res: ResponseWrapper) => this.affectIssuesPerCol(res.json),
              (error) => console.log(error));
      console.log('ddd')
  }

  affectIssuesPerCol(data) {
      this.issues = Object.assign({}, data);
  }

  getAllIssues() {
    this.issuecustomSce.getIssueCustoms()
    .then((issues) => this.issues = issues );
  }

    dragStart(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    dragend(ev) {
        console.error('dragend starts here');

        let data = ev.dataTransfer.getData('text');

        // this.searchActiveSprint();

        // this.affectIssuesToSprint();

        let parent = ev.target.parentElement;

        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].hidden = false;
        }
        console.log('cls' + parent.className);

        parent.style.border = '0px';

        console.error('dragend stops here');

    }

    dragleave(ev) {
        console.error('dragleave starts here');
        // let parent = ev.target.parentElement;
        if (ev.target.children !== undefined) {
            console.log('curr' + ev.target.className);
            for (let i = 0; i < ev.target.children.length; i++) {
                console.log(ev.target.children.length);
                if (ev.target.children[i].hidden) {
                    ev.target.children[i].hidden = false;
                    ev.target.style.border = '0px';
                }
            }
        }
    }

    allowDrop($event) {

      let elt = $event.target;
      while ((elt.id === undefined) || (elt.id.localeCompare('droppable') === -1)) {
          console.log('me ' + elt.className);
          elt = elt.parentElement;
          console.log('my parent ' + elt.className);
      }
      if (elt.id.localeCompare('droppable') !== -1) {
          $event.preventDefault();
          elt.style.border = '2px dashed blueviolet';
          console.log('count ' + elt.children.length)

          for (let i = 0; i < elt.children.length; i++) {
              elt.children[i].hidden = true;
          }
      }

/*
            console.log($event.target.className);
      if ($event.target.id.localeCompare('droppable') !== -1) {
          console.log('here droppable ' + $event.target.className)

          $event.preventDefault();
          $event.target.style.border = '2px dashed blueviolet';
          console.log('count ' + $event.target.children.length)
          for(let i = 0; i < $event.target.children.length; i++) {
              $event.target.children[i].hidden = true;
          }
          // console.log($event.target.children[i])
      } else {
          let elt = $event.target;
          console.log('init ' + elt.className);
          while ((elt.id.localeCompare('droppable') === -1) || (elt.id === undefined)) {
              console.log('me ' + elt.className);
              elt = elt.parentElement;
              console.log('my parent ' + elt.className);
          }
          console.log('found ' + elt.id)

          for(let i = 0; i < elt.children.length; i++) {
              elt.children[i].hidden = true;
          }
      }
      */
    }

    drop(ev) {
        console.error('dropev starts here')
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
    }

}
