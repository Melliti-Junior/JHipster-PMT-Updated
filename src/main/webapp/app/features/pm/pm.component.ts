import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/api';

@Component({
  selector: 'jhi-pm',
  templateUrl: './pm.component.html',
  styles: ['./pm.component.css']
})
export class PmComponent implements OnInit {

    items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [
            {
                label: 'Issues',
                icon: 'fa-tags',
                items: [
                    {label: 'Types'},
                    {label: 'Priorities'},
                    {label: 'Epics'},
                    {
                        label: 'Workflows',
                        items: [
                            {label: 'Steps'}
                        ]
                    }
                ]
            },
            {
                label: 'Projects',
                icon: 'fa-tasks',
                items: [
                    {label: 'Undo', icon: 'fa-mail-forward'},
                    {label: 'Redo', icon: 'fa-mail-reply'}
                ]
            },
            {
                label: 'Agile',
                icon: 'fa-columns',
                items: [
                    {label: 'Kanban', icon: 'fa-mail-forward'},
                    {label: 'Scrum', icon: 'fa-mail-reply'}
                ]
            },
            {
                label: 'Accounts',
                icon: 'fa-users',
                items: [
                    {label: 'Types'},
                    {label: 'Priorities'},
                    {label: 'Epics'},
                    {
                        label: 'Workflows',
                        items: [
                            {label: 'Steps'}
                        ]
                    }
                ]
            },
        ];
    }

    dragStart(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
      }

      allowDrop($event) {
        $event.preventDefault();
      }

     drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

     drop(ev) {
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
    }
}
