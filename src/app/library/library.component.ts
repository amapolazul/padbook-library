import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import * as papa from 'papaparse';
import {CsvFileReaderService} from '../infrastructure/csv/csv-file-reader.service';
import {BookEntity} from './library.domain';
import {BookService} from '../book/book.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {

    booksMatrix: Array<Array<BookEntity>>;
    booksArray: Array<BookEntity>;
    bookCategories: Set<string>;
    selectedCategory: string;

    constructor(public navCtrl: NavController,
                private router: Router,
                public csvFileReader: CsvFileReaderService,
                public bookService: BookService) {
        this.bookCategories = new Set();
    }

    ngOnInit() {
        this.csvFileReader.readCsvData().subscribe(
            data => this.extractData(data),
            err => this.handleError(err)
        )
    }

    private extractData(data) {
        let parsedData = papa.parse(data).data;
        parsedData.splice(0, 1);

        this.booksArray = parsedData.map(book => {
            let bookParsed = new BookEntity();
            bookParsed.title = book[1];
            bookParsed.type = book[2];
            bookParsed.url = book[3];
            return bookParsed;
        });

        this.booksArray.forEach((book) => {
            this.bookCategories.add(book.type)
        });

        this.booksMatrix = this.listToMatrix(this.booksArray, 2);
    }

    listToMatrix(list, elementsPerSubArray) {
        let matrix = [], i, k;

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(list[i]);
        }

        return matrix;
    }

    sortAlphabetically() {
        this.booksMatrix = this.listToMatrix(this.booksArray.sort(this.sortFunction), 2)
    }

    filterCategory(event) {
        let searchTerm = event.detail.value;
        this.booksMatrix =  this.listToMatrix(this.booksArray.filter(item => {
            return item.type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }),2);
    }

    filterByName(event) {
        let searchTerm = event.detail.value;
        this.booksMatrix =  this.listToMatrix(this.booksArray.filter(item => {
            return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }),2);
    }

    private sortFunction(a: BookEntity, b: BookEntity) {
        let titleBookA = a.title.toUpperCase();
        let titleBookB = b.title.toUpperCase();

        let comparison = 0;
        if (titleBookA > titleBookB) {
            comparison = 1;
        } else if (titleBookA < titleBookB) {
            comparison = -1;
        }
        return comparison;
    }

    openNewBook(bookEntity: BookEntity) {
        console.log(bookEntity);
        this.bookService.openNewBook(bookEntity.url);
        this.router.navigate(['/home']);
    }

    private handleError(err) {
        console.log('something went wrong: ', err);
    }
}
