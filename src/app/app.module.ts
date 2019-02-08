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
    declarations: [AppComponent, BookmarksComponent],
    entryComponents: [],
    imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [
        BookService,
        BookmarksService,
        DatabaseService,
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
