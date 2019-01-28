import { Component, OnInit } from '@angular/core';
import {BookmarksService} from './bookmarks.service';
import {BookMark} from './bookmark';
import {BookService} from '../book/book.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  bookMarks: Array<BookMark>;

  constructor(private bookMarkService : BookmarksService,
              private bookService: BookService,
              private router: Router,
              public toastController: ToastController) { }

  ngOnInit() {
    this.bookMarks = this.bookMarkService.getBookMarks();
  }

  goToPage(index) {
    this.bookService.goToPage(index);
    this.router.navigate(['/home']);
  }

  deleteBookMark(index) {
    this.bookMarkService.removeBookMark(index);
    this.presentToast();
  }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Marcador borrado correctamente',
            duration: 2000
        });
        toast.present();
    }

}
