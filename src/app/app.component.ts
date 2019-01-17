import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as ePub from 'epubjs';
import Book from 'epubjs/types/book';
import {BookService} from './book/book.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [];
  book: Book;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private bookService: BookService
  ) {
    this.initializeApp();

    this.book = bookService.getBook();

      this.book.ready.then(x => {
        this.appPages = this.book.navigation.toc.map(t => {
          return {title : t.label, href : t.href};
        });
      });
  }

  goToPage(href) {
    this.bookService.goToPageHref(href);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
