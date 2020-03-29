import {Injectable} from '@angular/core';
import {BookMark} from './bookmark';
import {DatabaseService} from '../database/database.service';

@Injectable({
    providedIn: 'root'
})
export class BookmarksService {

    constructor(private databaseService: DatabaseService) {

    }

    addBookMark(bookMark: BookMark) {
        return this.databaseService.insertBookmark(bookMark.pageIndex);
    }

    getBookMarks() {
        return this.databaseService.getBookMarkList(1);
    }

    removeBookMark(index) {
        return this.databaseService.deleteBookMark(index);
    }
}
