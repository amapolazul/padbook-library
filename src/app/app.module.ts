import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BookService} from './book/book.service';
import {BookmarksService} from './bookmarks/bookmarks.service';
import {BookmarksComponent} from './bookmarks/bookmarks.component';
import {DatabaseService} from './database/database.service';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { NgModule, ErrorHandler, Injectable } from "@angular/core";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as Sentry from "@sentry/browser";
import {CsvFileReaderService} from './infrastructure/csv/csv-file-reader.service';

import {HttpClientModule} from '@angular/common/http';
import {LibraryComponent} from './library/library.component';
import {HomeModalPage} from './home/home-modal/home-modal.page';
import {CreateNotesModalPage} from './home/create-note-modal/create-notes-modal.page';
import {FormsModule} from '@angular/forms';

Sentry.init({
    dsn: "https://e186c3712c204519a78cf3793a6df065@sentry.io/1384555"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    constructor() {}
    handleError(error) {
        Sentry.captureException(error.originalError || error);
        throw error;
    }
}

@NgModule({
    declarations: [AppComponent, BookmarksComponent, LibraryComponent, HomeModalPage, CreateNotesModalPage],
    entryComponents: [HomeModalPage, CreateNotesModalPage],
    imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
    providers: [
        BookService,
        BookmarksService,
        DatabaseService,
        CsvFileReaderService,
        StatusBar,
        SplashScreen,
        SQLite,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: ErrorHandler, useClass: SentryErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
