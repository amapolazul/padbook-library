import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import {BookmarksService} from '../bookmarks/bookmarks.service';
import {BookMark} from '../bookmarks/bookmark';
import Navigation from 'epubjs/types/navigation';
import {ToastController} from '@ionic/angular';
import {HammerGestureConfig} from '@angular/platform-browser';


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
    timeout;

    constructor(private bookService: BookService,
                private bookMarkService: BookmarksService,
                public toastController: ToastController) {

        this.book = this.bookService.getBook();
        this.rendition = this.book.renderTo('area');
        this.bookService.setRendtion(this.rendition);
        this.rendition.display();
        this.showElement = false;
    }

    ngOnInit() {
        this.book.ready.then(x => {
            this.navigation = this.book.navigation;
        });

        this.rendition.on('displayed', (event) => {
            const hammer = new HammerGestureConfig();
            const elemet = document.getElementById('touchlayer');
            const t = hammer.buildHammer(elemet);

            t.on("swiperight", () => {
                return this.rendition.prev();
            });

            t.on("swipeleft", () => {
                return this.rendition.next();
            });

            t.on("tap", () => {
                this.showHeader();
            })
        });
    }

    showHeader() {
        this.showElement = true;
        this.timeout = window.setTimeout(() => {
            this.showElement = false;
        }, 5000);

        return this.timeout;
    }

    nextPage() {
        window.clearTimeout(this.timeout);
        this.showHeader();
        return this.rendition.next();
    }

    prevPage() {
        window.clearTimeout(this.timeout);
        this.showHeader();
        return this.rendition.prev();
    }

    bookMarkPage() {
        window.clearTimeout(this.timeout);
        this.showHeader();
        const bookMark = new BookMark();
        bookMark.pageIndex = this.rendition.location.start.index;
        this.bookMarkService.addBookMark(bookMark).then(x => {
            this.presentToast('Marcador guardado correctamente');
        }).catch(err => {
            this.presentToast(err);
            console.log(err);
        });
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
