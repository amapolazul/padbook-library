import { Component, OnInit } from '@angular/core';
import {BookmarksService} from './bookmarks.service';
import {BookMark} from './bookmark';
import {BookService} from '../book/book.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  bookMarks: Array<BookMark>;

  constructor(private bookMarkService : BookmarksService,
              private bookService: BookService,
              private router: Router) { }

  ngOnInit() {
    this.bookMarks = this.bookMarkService.getBookMarks();
  }

  goToPage(index) {
    this.bookService.goToPage(index);
    this.router.navigate(['/home']);
  }

}
