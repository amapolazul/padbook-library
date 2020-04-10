import {Component, Input, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import Navigation from 'epubjs/types/navigation';
import {BookService} from '../../book/book.service';
import {ModalController} from '@ionic/angular';


@Component({
    selector: 'app-notes-modal',
    templateUrl: 'create-note-modal.page.html',
    styleUrls: ['create-modal.page.scss'],
})
export class CreateNotesModalPage implements OnInit {

    book: Book;
    rendition: Rendition;
    navigation: Navigation;

    textSelected: string;
    noteText: string;

    @Input() cfirange: string;
    @Input() text: string;


    constructor(private bookService: BookService,
                private modalController: ModalController) {

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();
    }

    ngOnInit() {
        this.textSelected = this.text.valueOf();
    }

    dismissModal() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    addNote() {
        this.rendition.annotations.add('highlight',
            this.cfirange,
            {},
            (e) => {} ,
            "hl",
            {"fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply"});
        this.dismissModal();
    }
}
