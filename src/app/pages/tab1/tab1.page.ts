import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  public articles$: Observable<Article[]>;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.articles$ = this.newsService.getTopHeadlines();
    // .subscribe(articles => this.articles.push(...articles));
  }

  // loadData(event: any){
  //   this.newsService.getTopHeadlinesByCategory('business', true)
  //   .subscribe(
  //     articles => {
  //       this.articles = articles;
  //       event.target.complete();
  //     }
  //   );
  // }

}
