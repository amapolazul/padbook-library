import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    db: SQLiteObject;

    configuration = {
        name: 'inclusion.db',
        location: 'default'
    };

    constructor(private sqlite: SQLite) {

        this.sqlite.create(this.configuration)
            .then((db: SQLiteObject) => {

            this.db = db;
            db.executeSql('create table if not exists bookmarks(page_index INTEGER PRIMARY KEY, book_id INTEGER )', [])
                .then(() => console.log('Executed SQL'))
                .catch(e => console.log(e));

            db.executeSql('create table if not exists books(id INTEGER PRIMARY KEY, title VARCHAR, type VARCHAR, url VARCHAR)', [])
                .then(() => console.log('Executed SQL'))
                .catch(e => console.log(e));


        }).catch(e => console.log(e));

    }

    getBookMarkList() {
        return this.db.executeSql('select * from bookmarks;', []);
    }

    deleteBookMark(index) {
        return this.db.executeSql('delete from bookmarks where page_index = ?;', [index]);
    }

    insertBookmark(index) {
        return this.db.executeSql('insert into bookmarks(page_index) values(?);', [index]);
    }

    insertBooks(recordData) {
        const id = recordData[0];
        const title = recordData[1];
        const type = recordData[2];
        const url = recordData[3];

        return this.db.executeSql('insert into books(id, title, type, url) values(?,?,?,?);', [id, title, type, url]);
    }
}
