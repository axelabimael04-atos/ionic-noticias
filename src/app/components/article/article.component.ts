import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces/index';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() index: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetController: ActionSheetController) { }

  ngOnInit() {}

  openArticle(){

    if(this.platform.is('ios') || this.platform.is('android')){
      const browser = this.iab.create(this.article.url);
    browser.show();
    } else {
      window.open(this.article.url, '_blank');
    }
  }

  async onOpenMenu(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Compartir',
        icon: 'share-outline',
        handler:()=> this.onShareArticle()
      },
      {
        text: 'Favorito',
        icon: 'heart-outline',
        handler:()=> this.onShareArticle()
      }
    ]
    });

    await actionSheet.present();
  }

  onShareArticle(){
    console.log('share article');
  }

  onToggleFavorite(){}

}
