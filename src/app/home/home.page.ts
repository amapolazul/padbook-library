import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import {BookmarksService} from '../bookmarks/bookmarks.service';
import {BookMark} from '../bookmarks/bookmark';
import Navigation from 'epubjs/types/navigation';
import {MenuController, ModalController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {CreateNotesModalPage} from './create-note-modal/create-notes-modal.page';
import Contents from 'epubjs/types/contents';
import Section from 'epubjs/types/section';
import {FontSizePopPage} from './popovers/font-size/font-size-pop.page';
import {StorageOptionsPopPage} from './popovers/storage-options/storage-options-pop.page';


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

    constructor(private bookService: BookService,
                private bookMarkService: BookmarksService,
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
                    thisRed.presentCreateNoteModal(cfiRange, textNode.wholeText);
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

    bookMarkPage() {
        const bookMark = new BookMark();
        bookMark.pageIndex = this.rendition.location.start.index;
        this.bookMarkService.addBookMark(bookMark).then(x => {
            this.presentToast('Marcador guardado correctamente');
        }).catch(err => {
            this.presentToast(err);
            console.log(err);
        });
    }

    openCustom() {
        this.menu.enable(true, 'search');
        this.menu.open('search');
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

    async presentStoragePopover(ev: any) {
        const popover = await this.popoverController.create({
            component: StorageOptionsPopPage,
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

    async presentCreateNoteModal(cfirange, text) {
        const modal = await this.modalController.create({
            component: CreateNotesModalPage,
            componentProps: {
                'cfirange': cfirange,
                'text': text
            }
        });
        return await modal.present();
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
