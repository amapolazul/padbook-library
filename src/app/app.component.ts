import {Component} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import Book from 'epubjs/types/book';
import {BookService} from './book/book.service';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import {CsvFileReaderService} from './infrastructure/csv/csv-file-reader.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    rootPage: any = 'Slide';
    public appPages = [];
    book: Book;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private bookService: BookService,
        private menu: MenuController,
        private navigationBar: NavigationBar,
        private csvReader: CsvFileReaderService
    ) {
        this.initializeApp();

        this.book = bookService.getBook();

        this.book.ready.then(x => {
            this.appPages = this.book.navigation.toc.map(t => {
                return {title : t.label, href : t.href};
            });
        });

        this.navigationBar.hideNavigationBar();
        this.navigationBar.setUp(true);
        this.statusBar.hide();
    }

    closeMenu() {
        this.menu.toggle();
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
