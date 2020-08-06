import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public pageTitle: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.pageTitle = this.activatedRoute.snapshot.paramMap.get('title');
  }

}