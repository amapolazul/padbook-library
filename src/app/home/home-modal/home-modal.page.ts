import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import Navigation from 'epubjs/types/navigation';
import {BookService} from '../../book/book.service';
import {ModalController} from '@ionic/angular';


@Component({
    selector: 'app-home-modal',
    templateUrl: 'home-modal.page.html',
    styleUrls: ['home-modal.page.scss'],
})
export class HomeModalPage implements OnInit {

    book: Book;
    rendition: Rendition;
    navigation: Navigation;
    showElement: boolean;

    constructor(private bookService: BookService,
                private modalController: ModalController) {

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();
    }

    ngOnInit() {

    }

    changeTheme(event) {
        let themeSelected = event.detail.value;

        if(themeSelected == 'dark') {
            this.rendition.themes.select('dark');
        } else if (themeSelected == 'light') {
            this.rendition.themes.select('light');
        } else {

        }
    }

    changeFontSize(event) {
        let sizeSelected = event.detail.value;
        this.rendition.themes.fontSize(sizeSelected);
    }

    dismissModal() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            'dismissed': true
        });
    }
}
