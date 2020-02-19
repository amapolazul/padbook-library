import {Injectable} from '@angular/core';

import * as papa from 'papaparse';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CsvFileReaderService {

    csvData: any[] = [];
    headerRow: any[] = [];

    constructor(private http: HttpClient) {
        console.log('Im in');
        this.readCsvData();
    }

    readCsvData() {
        this.http.get('assets/csv/test.csv', {
            headers: new HttpHeaders()
                .set('Content-Type', 'text/csv')
                .append('Access-Control-Allow-Methods', 'GET')
                .append('Access-Control-Allow-Origin', '*')
                .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
            responseType:'text'
        })
            .subscribe(
                data => this.extractData(data),
                err => this.handleError(err)
            );
    }

    private extractData(data) {
        let parsedData = papa.parse(data).data;

        this.headerRow = parsedData[0];

        parsedData.splice(0, 1);
        this.csvData = parsedData;
        console.log(this.csvData)
    }

    private handleError(err) {
        console.log('something went wrong: ', err);
    }

}