import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BookMark, BookNote, HighLight} from './models/library.models';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    db: SQLiteObject;

    configuration = {
        name: 'padbook.db',
        location: 'default'
    };

    bookMarks: BookMark[] = [];

    constructor(private sqlite: SQLite) {

        this.sqlite.create(this.configuration)
            .then((db: SQLiteObject) => {

            this.db = db;
            db.executeSql('create table if not exists bookmarks(id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER, cfi TEXT, book_page TEXT )', [])
                .then(() => console.log('Executed SQL'))
                .catch(e => console.log(e));

            db.executeSql('create table if not exists book_notes(id INTEGER PRIMARY KEY AUTOINCREMENT, cfi_range TEXT, text_selected TEXT, book_id INTEGER, note TEXT, book_page TEXT)', [])
                .then(() => console.log('Executed SQL'))
                .catch(e => console.log(e));

            db.executeSql('create table if not exists book_highlights(id INTEGER PRIMARY KEY AUTOINCREMENT, cfi_range TEXT, text_selected TEXT, book_id INTEGER, style TEXT)', [])
                .then(() => console.log('Executed SQL'))
                .catch(e => console.log(e));

            console.log('instance ', this.db);


        }).catch(e => console.log(e));

    }

    getBookMarkList(bookId) {
        // return Promise.resolve({ rows : this.bookMarks});
        return this.db.executeSql('select * from bookmarks where book_id = ?', [bookId]);
    }

    deleteBookMark(bookMark: BookMark) {
        return this.db.executeSql('delete from bookmarks where id = ?', [bookMark.id]);
    }

    insertBookmark(bookMark: BookMark) {
        // return Promise.resolve(this.bookMarks.push(bookMark));
        return this.db.executeSql('insert into bookmarks(book_id, cfi, book_page) values(?,?,?)', [bookMark.book_id, bookMark.cfi, bookMark.book_page]);
    }

    getHighLightsbyBookId(bookId) {
        return this.db.executeSql('select * from book_highlights where book_id = ?', [bookId]);
    }

    deleteHighlightById(bookHighLight: HighLight) {
        return this.db.executeSql('delete from book_highlights where id = ? and book_id = ?', [bookHighLight.id, bookHighLight.book_id]);
    }

    insertHighLight(bookHighLight: HighLight) {
        return this.db.executeSql('insert into book_highlights(cfi_range, text_selected, book_id, style) values(?,?,?,?) ',
            [bookHighLight.cfi_range, bookHighLight.text_selected, bookHighLight.book_id, bookHighLight.style]);
    }

    getNotesbyBookId(bookId) {
        return this.db.executeSql('select * from book_notes where book_id = ?;', [bookId]);
    }

    deleteNoteById(bookNote: BookNote) {
        return this.db.executeSql('delete from book_notes where id = ? and book_id = ?;', [bookNote.id, bookNote.book_id]);
    }

    insertBookNote(bookNote: BookNote) {
        return this.db.executeSql('insert into book_notes(cfi_range, text_selected, book_id, note, book_page) values(?,?,?,?,?);',
            [bookNote.cfi_range, bookNote.text_selected, bookNote.book_id, bookNote.note, bookNote.book_page]);
    }

    updateNoteBook(bookNote: BookNote) {
        return this.db.executeSql('UPDATE book_notes SET note = ? WHERE id = ?', [bookNote.note, bookNote.id]);
    }
}
