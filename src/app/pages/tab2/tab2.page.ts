import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces/index';
import { SegmentChangeEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ];

  public selectedCategory: string = this.categories[0];

  public articles: Article[] = []; // > Observable > async para template

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {

    this.newsService.getTopHeadlinesByCategory(this.selectedCategory).subscribe(
      articles => {
        this.articles = [...articles];
      }
    );
  }

  segmentChanged(event: Event) {
    this.selectedCategory = (event as CustomEvent<SegmentChangeEventDetail>).detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe(articles => {
        this.articles = [...articles];
      });

  }

  loadData(event: any) {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
      .subscribe(
        articles => {
          this.articles = articles;
          event.target.complete();
        }
      );
  }

}
