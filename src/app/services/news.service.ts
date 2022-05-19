/* eslint-disable curly */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsResponse } from '../interfaces';
import { Article, ArticlesByCategoryAndPage } from '../interfaces/index';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class NewsService {

  readonly apiKey =  environment.apiKey;
  readonly apiUrl = 'https://newsapi.org/v2';

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  private articlesByCategoryAndPage$: BehaviorSubject<ArticlesByCategoryAndPage> = new BehaviorSubject<ArticlesByCategoryAndPage>({});

  constructor(private http: HttpClient) { }

  private executeQuery<T>(endpoint: string){
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      params: {
        apiKey: this.apiKey,
        country: 'us'
      }
    });
  }

  getTopHeadlines(): Observable<Article[]>{
    return this.executeQuery<NewsResponse>(`/top-headlines?category=business`).pipe(
      map(resp=> resp.articles)
    );
  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]>{

    if(loadMore){
      return this.getArticlesByCategory(category);
    }

    if(this.articlesByCategoryAndPage[category]){
      // return of(this.articlesByCategoryAndPage[category].articles);
      return this.articlesByCategoryAndPage$.asObservable().pipe(
        map(resp => resp[category].articles)
      );
    }

    return this.getArticlesByCategory(category);

  }

  private getArticlesByCategory(category: string): Observable<Article[]>{
    if(Object.keys(this.articlesByCategoryAndPage).includes(category)){
      // this.articlesByCategoryAndPage[category].page +=1;
    } else {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      };
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
    .pipe(
      map(resp => {
        if(resp.articles.length === 0) return [];
        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [...this.articlesByCategoryAndPage[category].articles, ...resp.articles]
        };
        return this.articlesByCategoryAndPage[category].articles;
      })
    );

  }


}
