import {Injectable, Output} from '@angular/core';
import * as ePub from 'epubjs';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import { EventEmitter } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class BookService {

    book: Book;
    rendtion: Rendition;

    isOpen: boolean;

    @Output() bookEmitter: EventEmitter<Book>;

    constructor() {
        this.bookEmitter = new EventEmitter<Book>();
    }

    setRendtion(rendition) {
        this.rendtion = rendition;
    }

    getRendition() {
        return this.rendtion;
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

    openNewBook(bookPath: string) {
        this.book = new ePub.Book(bookPath);
        this.bookEmitter.emit(this.book)
    }

    setIsOpen(value) {
        this.isOpen = value;
    }

    getIsOpen() {
        return this.isOpen;
    }
}
