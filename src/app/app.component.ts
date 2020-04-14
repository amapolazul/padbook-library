import {Component} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import Book from 'epubjs/types/book';
import {BookService} from './book/book.service';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import {CsvFileReaderService} from './infrastructure/csv/csv-file-reader.service';
import {DatabaseService} from './database/database.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    rootPage: any = 'Slide';
    public appPages = [];
    book: Book;
    bookName: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private bookService: BookService,
        private menu: MenuController,
        private navigationBar: NavigationBar,
        private csvReader: CsvFileReaderService,
        private database: DatabaseService
    ) {
        this.initializeApp();

        this.bookService.bookEmitter.subscribe( book => {
            this.createTableOfContent(book);
        });

        this.navigationBar.hideNavigationBar();
        this.navigationBar.setUp(true);
        this.statusBar.hide();
    }

    createTableOfContent(book) {
        this.book = book;

        this.bookName = this.bookService.getBookMetadata().title;

        this.book.ready.then(x => {
            this.book.navigation.toc.forEach(t => {
                this.appPages.push({title : t.label, href : t.href});
                console.log({title : t.label, href : t.href});
                t.subitems.forEach(si => {
                    this.appPages.push({title : si.label, href : si.href});
                });
            });
        });
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
