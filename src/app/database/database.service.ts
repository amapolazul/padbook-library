import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    db: SQLiteObject;

    configuration = {
        name: 'data.db',
        location: 'default'
    };

    constructor(private sqlite: SQLite) {

        this.sqlite.create(this.configuration)
            .then((db: SQLiteObject) => {

                this.db = db;
                db.executeSql('create table if not exists bookmarks(index INTEGER PRIMARY KEY)', [])
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));


            }).catch(e => console.log(e));
    }

    getBookMarkList() {
        return this.db.executeSql('select * from bookmarks');
    }

    deleteBookMark(index) {
        return this.db.executeSql('delete from bookmarks where index = ?', [index]);
    }

    insertBookmark(index) {
        return this.db.executeSql('insert into bookmarks(index) values(?)', [index]);
    }
}
