import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import Navigation from 'epubjs/types/navigation';
import {MenuController, ModalController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import Contents from 'epubjs/types/contents';
import Section from 'epubjs/types/section';
import {FontSizePopPage} from './popovers/font-size/font-size-pop.page';
import {FormControl, FormGroup} from '@angular/forms';
import {HighlightPopPage} from './popovers/highlight-popover/highlight-pop.page';
import {DatabaseService} from '../database/database.service';
import {BookMark, BookNote, HighLight} from '../database/models/library.models';
import {ColorDictionaryService} from '../commons/color-dictionary.service';
import {BookmarksComponent} from '../bookmarks/bookmarks.component';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    book: Book;
    rendition: Rendition;
    navigation: Navigation;
    showElement: boolean;
    searchResults: Array<any>;
    storageOptions: FormGroup;
    showBookMarks: boolean;
    showNotes: boolean;
    bookName: string;
    bookMarks: BookMark[];

    constructor(private bookService: BookService,
                private databaseService: DatabaseService,
                private modalController: ModalController,
                private toastController: ToastController,
                private popoverController: PopoverController,
                private colorDictionaryService: ColorDictionaryService,
                private menu: MenuController,
                private plt: Platform,
                private router: Router) {

        this.book = this.bookService.getBook();
        this.rendition = this.book.renderTo('area');
        this.rendition.display();
        this.bookService.setRendtion(this.rendition);
        this.showElement = false;
        this.searchResults = new Array<any>();

        this.showBookMarks = true;
        this.showNotes = false;
        this.storageOptions = new FormGroup({
            opts: new FormControl({value: 'bookmarks', disabled: false})
        });

        this.bookName = this.bookService.getBookMetadata().title;
    }

    ngOnInit() {
        let thisRed = this;

        this.book.ready.then(x => {
            this.navigation = this.book.navigation;
        });

        this.rendition.on('displayed', (event) => {

        });

        this.rendition.on('click', (event) => {
            thisRed.showHeader();
        });

        this.rendition.on('selected', function(cfiRange) {

            this.book.getRange(cfiRange).then(function (range) {
                if (range) {
                    const text = range.toString();
                    const textNode = document.createTextNode(text);
                    thisRed.presentHighlightPopover(cfiRange, textNode.wholeText);
                } else {
                    console.log('highlight clicked', cfiRange);
                }
            });
        });

        this.rendition.hooks.content.register((contents: Contents) => {


            const el = contents.document.documentElement;

            if (el) {

                //Enable swipe gesture to flip a page
                let start: Touch;
                let end: Touch;

                el.addEventListener('touchstart', (event: TouchEvent) => {
                    start = event.changedTouches[0];
                });

                el.addEventListener('touchend', (event: TouchEvent) => {
                    end = event.changedTouches[0];
                    const elBook = document.querySelector('app-home'); //Parent div, which contains the #area div
                    if( elBook ) {
                        const bound = elBook.getBoundingClientRect();
                        const hr = (end.screenX - start.screenX) / bound.width;
                        const vr = Math.abs((end.screenY - start.screenY) / bound.height);
                        if (hr > 0.25 && vr < 0.1) {
                            console.log(this.bookService.getRendition().location.start.displayed.page);
                            return thisRed.rendition.prev();
                        }
                        if (hr < -0.25 && vr < 0.1)  {
                            console.log(this.bookService.getRendition().location.start.displayed.page);
                            return thisRed.rendition.next();
                        }
                    }
                });
        }});

        this.plt.backButton.subscribeWithPriority( 9999, () => {
            console.log("not do anything");
        });

        this.rendition.themes.register('dark', 'assets/themes/themes.css');
        this.rendition.themes.register('light', 'assets/themes/themes.css');

        // Agrega diego
        // this.rendition.themes.default({
        //     h2: {
        //         'font-size': '32px',
        //         color: 'purple'
        //     },
        //     p: {
        //         "margin": '10px'
        //     }
        // });

        this.initializeHighLights();
        this.initializeNotes();
    }

    searchBook(event) {
        const searchTerm = event.detail.value;
        if(searchTerm && searchTerm !== '') {
            this.book.spine.each((item: Section) => {
                this.searchResults = item.find(searchTerm);
                console.log(this.searchResults);
            });
        }
    }

    showHeader() {
        if(this.showElement) {
            this.showElement = false;
        } else {
            this.showElement = true;
        }
    }

    nextPage() {
        console.log(this.bookService.getRendition().location.start.displayed.page);
        return this.rendition.next();
    }

    prevPage() {
        console.log(this.bookService.getRendition().location.start.displayed.page);
        return this.rendition.prev();
    }

    goToPageFromBookMark(bookMark) {
        this.bookService.goToPageHref(bookMark.cfiRange);
    }

    bookMarkPage() {
        const bookMark = new BookMark();
        bookMark.book_page = this.rendition.location.start.displayed.page.toString();
        bookMark.book_id = this.bookService.getBookMetadata().id;
        bookMark.cfi = this.bookService.getRendition().location.start.cfi;
        console.log(bookMark);
        this.databaseService.insertBookmark(bookMark).then(x => {
            this.presentToast('Marcador guardado correctamente');
        }).catch(err => {
            this.presentToast(err.error);
        });
    }

    openCustom(menuId) {
        this.menu.enable(true, menuId);
        this.menu.open(menuId);
        this.showHeader();
    }

    goToPageFromCfi(cfi) {
        this.rendition.display(cfi);
        this.menu.close('search');
    }

    async presentStylesPopOver(ev: any) {
        const popover = await this.popoverController.create({
            component: FontSizePopPage,
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

    async presentHighlightPopover(cfirange, text) {
        const popover = await this.popoverController.create({
            component: HighlightPopPage,
            componentProps: {
                cfirange: cfirange,
                text: text
            },
            translucent: true
        });
        return await popover.present();
    }

    async presentPersistence(cfirange, text) {
        const popover = await this.modalController.create({
            component: BookmarksComponent
        });
        return await popover.present();
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }

    doSubmit(event) {
        const storageValues = this.storageOptions.getRawValue();
        if(storageValues.opts === 'notes') {
            this.showNotes = true;
            this.showBookMarks = false;
        } else {
            this.showNotes = false;
            this.showBookMarks = true;
        }
        event.preventDefault();
    }

    initializeHighLights() {
        this.databaseService.getHighLightsbyBookId(this.bookService.getBookMetadata().id).then(highLightRecords => {
            for (let i = 0; i < highLightRecords.rows.length; i++) {
                const item = <HighLight> highLightRecords.rows.item(i);
                const color = this.colorDictionaryService.getColor(item.style);
                this.rendition.annotations.add('highlight', item.cfi_range, {}, (e) => {} , "hl", color);
            }
        });
    }

    initializeNotes() {
        this.databaseService.getNotesbyBookId(this.bookService.getBookMetadata().id).then(notesRecords => {
            for (let i = 0; i < notesRecords.rows.length; i++) {
                const item = <BookNote> notesRecords.rows.item(i);
                this.rendition.annotations.add('highlight', item.cfi_range, {}, (e) => {} , "hl", {"fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply"});
            }
        });
    }
}
