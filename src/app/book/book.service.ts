import {Injectable} from '@angular/core';
import * as ePub from 'epubjs';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    book: Book;
    rendtion: Rendition;

    isOpen: boolean;

    constructor() {
        this.book = new ePub.Book('assets/epub/inclusion.epub');
    }

    setRendtion(rendition) {
        this.rendtion = rendition;
    }

    goToPage(index: number) {
        this.rendtion.display(index);
    }

    goToPageHref(href: string) {
        this.rendtion.display(href);
    }

    getBook() {
        return this.book;
    }

    setIsOpen(value) {
        this.isOpen = value;
    }

    getIsOpen() {
        return this.isOpen;
    }
}
