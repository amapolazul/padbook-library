import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../../../book/book.service';
import {PopoverController} from '@ionic/angular';


@Component({
    selector: 'app-storage-pop',
    templateUrl: 'storage-options-pop.page.html',
    styleUrls: ['storage-options-pop.page.scss'],
})
export class StorageOptionsPopPage implements OnInit {

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

    dismissPopover() {
        this.popOverController.dismiss();
    }
}
