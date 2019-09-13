import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  year: string;
  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
  }

}
