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
        return this.databaseService.insertBookmark(bookMark.pageIndex);
    }

    getBookMarks() {
        return this.databaseService.getBookMarkList();
    }

    removeBookMark(index) {
        return this.databaseService.deleteBookMark(index).then(x => {
            this.bookMarks.splice(index, 1);
        })
    }
}