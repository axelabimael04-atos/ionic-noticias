import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsResponse } from '../interfaces';
import { Article, ArticlesByCategoryAndPage } from '../interfaces/index';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
// observable, subject, behaviorsubject << 
// , 
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  readonly apiKey = environment.apiKey;
  readonly apiUrl = 'https://newsapi.org/v2';

  private articlesByCategoryAndPage$: BehaviorSubject<ArticlesByCategoryAndPage> = new BehaviorSubject<ArticlesByCategoryAndPage>({});

  constructor(private http: HttpClient) {}

  private executeQuery<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      params: {
        apiKey: this.apiKey,
        country: 'us'
      }
    });
  }

  getTopHeadlines(): Observable<Article[]> {
    return this.executeQuery<NewsResponse>(`/top-headlines?category=business`).pipe(
      map(resp => resp.articles)
    );
  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {

    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    if (this.articlesByCategoryAndPage$.getValue()[category]) {
      return this.articlesByCategoryAndPage$.asObservable().pipe(
        map(resp => resp[category].articles)
      );
    }

    return this.getArticlesByCategory(category);

  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    const categoryExist: boolean = Object.keys(this.articlesByCategoryAndPage$.getValue()).includes(category);
    if (!categoryExist) {
      const currentState: ArticlesByCategoryAndPage = this.articlesByCategoryAndPage$.getValue();
      this.articlesByCategoryAndPage$.next({
        ...currentState,
        [category]: {
          page: 0,
          articles: []
        }
      });
    }
    const articlesByCategory$ = this.articlesByCategoryAndPage$.asObservable();
    return articlesByCategory$.pipe(
      take(1),
      switchMap((articlesByCategory) => {
        const newPage: number = articlesByCategory[category].page + 1;
        return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${newPage}`).pipe(
          map((response) => {
            if (response.articles.length === 0) return [];
            const newArticlesState = {
              ...articlesByCategory,
              [category]: {
                page: newPage,
                articles: [...articlesByCategory[category].articles, ...response.articles]
              }
            };
            console.log(newArticlesState);
            this.articlesByCategoryAndPage$.next(newArticlesState)
            return this.articlesByCategoryAndPage$.getValue()[category].articles;
          })
        )
      }),
    );
  }


}
