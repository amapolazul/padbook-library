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
        this.readCsvData();
    }

    readCsvData() {
        return this.http.get('assets/csv/anttest.csv', {
            headers: new HttpHeaders()
                .set('Content-Type', 'text/csv')
                .append('Access-Control-Allow-Methods', 'GET')
                .append('Access-Control-Allow-Origin', '*')
                .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
            responseType:'text'
        })
    }
}