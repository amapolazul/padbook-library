import {Injectable} from '@angular/core';
import {BookMark} from './bookmark';

@Injectable({
    providedIn: 'root'
})
export class BookmarksService {

    bookMarks: Array<BookMark>;

    constructor() {
        this.bookMarks = new Array<BookMark>();
    }

    addBookMark(bookMark: BookMark) {
        this.bookMarks.push(bookMark);
    }

    getBookMarks() {
        return this.bookMarks;
    }
}