import { Component } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public readonly routes: Routes;
  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.routes = [...this.activatedRoute.routeConfig.children].filter((r) => r.path !== '');
  }

}
