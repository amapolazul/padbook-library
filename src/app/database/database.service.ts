import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    configuration = {
        name: 'data.db',
        location: 'default'
    };


    constructor() {

        // this.sqlite.create(this.configuration)
        //     .then((db: SQLiteObject) => {
        //
        //         this.db = db;
        //         console.log("sadfasdf", this.db);
        //         db.executeSql('create table if not exists bookmarks(index INTEGER PRIMARY KEY)', [])
        //             .then(() => console.log('Executed SQL'))
        //             .catch(e => console.log(e));
        //
        //
        //     })
        //     .catch(e => console.log(e));
    }
    //
    // getBookMarkList() {
    //     return this.db.executeSql('select * from bookmarks');
    // }
    //
    // deleteBookMark(index) {
    //     return this.db.executeSql('delete from bookmarks where index = ?', [index]);
    // }

    // insertBookmark(index) {
    //     const key = 'index-' + index;
    //     this.storage.set(key, index);
    // }
}
