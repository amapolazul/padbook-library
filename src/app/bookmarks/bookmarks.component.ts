import {Component, OnInit} from '@angular/core';
import {BookService} from '../book/book.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {BookEntity} from '../library/library.domain';
import {BookMark} from '../database/models/library.models';
import {DatabaseService} from '../database/database.service';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

    bookMarks: Array<BookMark> = [];
    bookMetadata: BookEntity;

    constructor(private bookService: BookService,
                private router: Router,
                private databaseService: DatabaseService,
                public toastController: ToastController) {

        this.bookMetadata = this.bookService.getBookMetadata();

    }

    ngOnInit() {
        this.initializeBookMarks();
    }

    initializeBookMarks() {

        this.databaseService.getBookMarkList(this.bookMetadata.id).then(x => {

            for (let i = 0; i < x.rows.length; i++) {
                const item = x.rows.item(i);
                const bookMark = new BookMark();
                bookMark.id = item.id;
                bookMark.cfi = item.cfi;
                bookMark.book_id = item.book_id;
                this.bookMarks.push(bookMark);
            }
        });
    }

    goToPage(index) {
        this.bookService.goToPage(index);
        this.router.navigate(['/home']);
    }

    deleteBookMark(bookMark) {
        this.databaseService.deleteBookMark(bookMark).then(x => {
            this.presentToast('Bookmark borrado correctamente');
            this.bookMarks = [];
            this.initializeBookMarks();
        }).catch(err => {
            this.presentToast(err);
        });
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
