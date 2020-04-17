import {Injectable, Output} from '@angular/core';
import * as ePub from 'epubjs';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import { EventEmitter } from "@angular/core";
import {BookEntity} from '../library/library.domain';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    book: Book;
    rendtion: Rendition;
    bookMetadata: BookEntity;
    lastFontSize: number;
    isOpen: boolean;

    bookMarkCfi: string;

    @Output() bookEmitter: EventEmitter<Book>;

    constructor() {
        this.bookEmitter = new EventEmitter<Book>();
        this.lastFontSize = 100;
    }

    setBookMetadata(bookMetadata: BookEntity) {
        this.bookMetadata = bookMetadata;
    }

    getBookMetadata() {
        return this.bookMetadata;
    }

    setLastFontSizeSize(size) {
        this.lastFontSize = size;
    }

    getLastFontsize() {
        return this.lastFontSize;
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
        return this.rendtion.display(href);
    }

    getBook() {
        return this.book;
    }

    openNewBook(bookPath: string) {
        this.book = new ePub.Book(bookPath);
        this.bookEmitter.emit(this.book);
    }

    setIsOpen(value) {
        this.isOpen = value;
    }

    getIsOpen() {
        return this.isOpen;
    }
}
