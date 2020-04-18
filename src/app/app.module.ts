import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BookService} from './book/book.service';
import {BookmarksComponent} from './bookmarks/bookmarks.component';
import {DatabaseService} from './database/database.service';
import {SQLite} from '@ionic-native/sqlite/ngx';

import {ErrorHandler, Injectable, NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import * as Sentry from '@sentry/browser';
import {CsvFileReaderService} from './infrastructure/csv/csv-file-reader.service';

import {HttpClientModule} from '@angular/common/http';
import {LibraryComponent} from './library/library.component';
import {CreateNotesModalPage} from './home/create-note-modal/create-notes-modal.page';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontSizePopPage} from './home/popovers/font-size/font-size-pop.page';
import {StorageOptionsPopPage} from './home/popovers/storage-options/storage-options-pop.page';
import {HighlightPopPage} from './home/popovers/highlight-popover/highlight-pop.page';
import {ColorDictionaryService} from './commons/color-dictionary.service';
import {EditNotesModalPage} from './home/edit-note-modal/edit-notes-modal.page';
import {HighlightDeletePopPage} from './home/popovers/highlight-delete-popover/highlight-delete-pop.page';

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
    declarations: [AppComponent, BookmarksComponent, LibraryComponent, CreateNotesModalPage, FontSizePopPage, StorageOptionsPopPage, HighlightPopPage, EditNotesModalPage, HighlightDeletePopPage],
    entryComponents: [CreateNotesModalPage, FontSizePopPage, StorageOptionsPopPage, HighlightPopPage, EditNotesModalPage, HighlightDeletePopPage],
    imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
    providers: [
        BookService,
        DatabaseService,
        CsvFileReaderService,
        StatusBar,
        SplashScreen,
        SQLite,
        ColorDictionaryService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: ErrorHandler, useClass: SentryErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
