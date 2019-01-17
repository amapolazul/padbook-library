import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import {BookmarksService} from '../bookmarks/bookmarks.service';
import {BookMark} from '../bookmarks/bookmark';
import Navigation from 'epubjs/types/navigation';
import {Router} from '@angular/router';
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

    constructor(private bookService: BookService,
                private bookMarkService: BookmarksService,
                private router: Router,
                public toastController: ToastController) {

        this.book = this.bookService.getBook();
        this.rendition = this.book.renderTo('area');
        this.bookService.setRendtion(this.rendition);
        var displayed = this.rendition.display();
    }

    ngOnInit() {
        this.book.ready.then(x => {
            this.navigation = this.book.navigation;
        });

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
