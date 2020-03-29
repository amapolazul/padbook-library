import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../../../book/book.service';
import {PopoverController} from '@ionic/angular';


@Component({
    selector: 'app-font-pop',
    templateUrl: 'font-size-pop.page.html',
    styleUrls: ['font-size-pop.page.scss'],
})
export class FontSizePopPage implements OnInit {

    book: Book;
    rendition: Rendition;
    currentSize: number;
    sizeRate: number;

    constructor(private bookService: BookService,
                private popOverController: PopoverController) {

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();
        this.currentSize = this.bookService.getLastFontsize();
        this.sizeRate = 10;
    }

    ngOnInit() {

    }

    increaseSize() {
        let sizeIncreased = this.currentSize + this.sizeRate;
        this.currentSize = sizeIncreased;
        this.bookService.setLastFontSizeSize(sizeIncreased);
        let size = sizeIncreased.toString().concat('%');
        this.rendition.themes.fontSize(size);
    }

    decreaseSize() {
        let sizeDecreased = this.currentSize - this.sizeRate;
        this.currentSize = sizeDecreased;
        this.bookService.setLastFontSizeSize(sizeDecreased);
        let size = sizeDecreased.toString().concat('%');
        this.rendition.themes.fontSize(size);
    }

    changeTheme(theme) {
        this.rendition.themes.select(theme);
    }

    dismissPopover() {
        this.popOverController.dismiss();
    }
}
