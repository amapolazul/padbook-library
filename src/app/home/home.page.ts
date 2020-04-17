import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import Navigation from 'epubjs/types/navigation';
import {MenuController, ModalController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import Contents from 'epubjs/types/contents';
import Section from 'epubjs/types/section';
import {FontSizePopPage} from './popovers/font-size/font-size-pop.page';
import {FormControl, FormGroup} from '@angular/forms';
import {HighlightPopPage} from './popovers/highlight-popover/highlight-pop.page';
import {DatabaseService} from '../database/database.service';
import {BookMark} from '../database/models/library.models';


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
                public toastController: ToastController,
                public popoverController: PopoverController,
                private menu: MenuController,
                public plt: Platform,
                private router: Router) {

        this.book = this.bookService.getBook();
        this.rendition = this.book.renderTo('area');
        this.bookService.setRendtion(this.rendition);
        this.rendition.display();
        this.showElement = false;
        this.searchResults = new Array<any>();

        this.showBookMarks = true;
        this.showNotes = false;
        this.storageOptions = new FormGroup({
            opts: new FormControl({value: 'bookmarks', disabled: false})
        });

        this.bookName = this.bookService.getBookMetadata().title;
        this.bookMarks = [];
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

        this.rendition.on("selected", function(cfiRange) {

            this.book.getRange(cfiRange).then(function (range) {

                if (range) {
                    let text = range.toString();
                    let textNode = document.createTextNode(text);
                    thisRed.presentHighlightPopover(cfiRange, textNode.wholeText);
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
                        if (hr > 0.25 && vr < 0.1) return thisRed.rendition.prev();
                        if (hr < -0.25 && vr < 0.1) return thisRed.rendition.next();
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

        // this.initializeBookMarks();
    }

    searchBook(event) {
        let searchTerm = event.detail.value;
        if(searchTerm && searchTerm !== '') {
            this.book.spine.each((item: Section) => {
                this.searchResults = item.find(searchTerm);
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
        return this.rendition.next();
    }

    prevPage() {
        return this.rendition.prev();
    }

    goToPageFromBookMark(bookMark) {
        this.bookService.goToPageHref(bookMark.cfiRange);
    }

    bookMarkPage() {
        const bookMark = new BookMark();
        bookMark.book_id = this.bookService.getBookMetadata().id;
        bookMark.cfi = this.bookService.getRendition().location.start.cfi;
        console.log('bookmark to insert', bookMark);
        this.databaseService.insertBookmark(bookMark).then(x => {
            this.presentToast('Marcador guardado correctamente');
            this.initializeBookMarks();
        }).catch(err => {
            this.presentToast(err);
            console.log(err);
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

    initializeBookMarks() {
        this.bookMarks = [];
        this.databaseService.getBookMarkList(this.bookService.getBookMetadata().id).then(x => {

            for (let i = 0; i < x.rows.length; i++) {
                console.log('bookmarks', x.rows);
                const item = x.rows.item(i);
                const bookMark = new BookMark();
                bookMark.id = item.id;
                bookMark.cfi = item.cfi;
                bookMark.book_id = item.book_id;
                this.bookMarks.push(bookMark);
            }
        });
    }
}
