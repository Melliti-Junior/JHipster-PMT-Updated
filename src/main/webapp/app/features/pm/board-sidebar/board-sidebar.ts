import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-board-sidebar',
  templateUrl: './board-sidebar.html',
  styleUrls: ['./board-sidebar.css']
})
export class BoardSidebar implements OnInit {

    imgPath: string;

    cols: string[] = ['Open', 'Doing', 'Done'];
  constructor() { }

  ngOnInit() {

  }
}
