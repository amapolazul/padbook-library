import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import {BookmarksService} from '../bookmarks/bookmarks.service';
import {BookMark} from '../bookmarks/bookmark';
import Navigation from 'epubjs/types/navigation';
import {ToastController} from '@ionic/angular';


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

            let start = null;
            let end = null;
            const el = document.getElementById('touchlayer');

            el.addEventListener('touchstart', event => {
                start = event.changedTouches[0];
            });
            el.addEventListener('touchend', event => {
                end = event.changedTouches[0];

                let hr = (end.screenX - start.screenX) / el.getBoundingClientRect().width;
                let vr = (end.screenY - start.screenY) / el.getBoundingClientRect().height;

                if (hr > vr && hr > 0.25) return this.rendition.prev();
                if (hr < vr && hr < -0.25) return this.rendition.next();
                if (vr > hr && vr > 0.25) return;
                if (vr < hr && vr < -0.25) return;
            });
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
        this.bookMarkService.addBookMark(bookMark);
        this.presentToast();
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Marcador guardado correctamente',
            duration: 2000
        });
        toast.present();
    }
}
