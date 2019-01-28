import {Injectable} from '@angular/core';
import {BookMark} from './bookmark';
import {DatabaseService} from '../database/database.service';

@Injectable({
    providedIn: 'root'
})
export class BookmarksService {

    bookMarks: Array<BookMark>;

    constructor(private databaseService: DatabaseService) {
        this.bookMarks = new Array<BookMark>();
    }

    addBookMark(bookMark: BookMark) {
        this.bookMarks.push(bookMark);
    }

    getBookMarks() {
        return this.bookMarks;
    }

    removeBookMark(index) {
        this.bookMarks.splice(index, 1);
    }
}