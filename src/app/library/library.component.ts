import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import * as papa from 'papaparse';
import {CsvFileReaderService} from '../infrastructure/csv/csv-file-reader.service';
import {Book} from './library.domain';


@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {

    booksMatrix: Array<Array<Book>>;

    constructor(public navCtrl: NavController,
                public csvFileReader: CsvFileReaderService) {

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

        let numberOfRows = Math.ceil(parsedData.length / 2);
        let books = parsedData.map(book => {
            let bookParsed = new Book();
            bookParsed.title = book[1];
            bookParsed.type = book[2];
            bookParsed.url = book[3];
            return bookParsed;
        });

        this.booksMatrix = this.listToMatrix(books, 2);

        console.log(this.booksMatrix)
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

    private handleError(err) {
        console.log('something went wrong: ', err);
    }
}
