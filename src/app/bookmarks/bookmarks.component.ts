import { Component, OnInit } from '@angular/core';
import {BookmarksService} from './bookmarks.service';
import {BookMark} from './bookmark';
import {BookService} from '../book/book.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {DatabaseService} from '../database/database.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  bookMarks: Array<BookMark> = [];

  constructor(private bookMarkService: BookmarksService,
              private bookService: BookService,
              private router: Router,
              private database: DatabaseService,
              public toastController: ToastController) {

              }

  ngOnInit() {

    this.database.getBookMarkList().then( x  => {

      for (let i = 0; i < x.rows.length; i++) {
        const item = x.rows.item(i);
        const bookMark = new BookMark();
        bookMark.pageIndex = item.page_index;
        this.bookMarks.push(bookMark);
      }
    });
  }

  goToPage(index) {
    this.bookService.goToPage(index);
    this.router.navigate(['/home']);
  }

  deleteBookMark(index) {
    this.bookMarkService.removeBookMark(index).then(x => {
        this.presentToast("Bookmark borrado correctamente");
        this.bookMarks.splice(index, 1);
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
