import {NgModule} from '@angular/core';
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

@NgModule({
    declarations: [AppComponent, BookmarksComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [
        BookService,
        BookmarksService,
        DatabaseService,
        StatusBar,
        SplashScreen,
        SQLite,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
