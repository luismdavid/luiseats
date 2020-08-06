import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-skeleton',
  templateUrl: './explore-skeleton.component.html',
  styleUrls: ['./explore-skeleton.component.scss'],
})
export class ExploreSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  array(times: number) {
    const range = [];
    for (let i = 1; i < times + 1; i++) {
      range.push(i);
    }
    return range;
  }

}
