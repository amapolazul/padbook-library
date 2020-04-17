import {Component, Input, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import Navigation from 'epubjs/types/navigation';
import {BookService} from '../../book/book.service';
import {ModalController, ToastController} from '@ionic/angular';
import {DatabaseService} from '../../database/database.service';
import {BookNote} from '../../database/models/library.models';


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
                private toastController: ToastController,
                private databaseService: DatabaseService,
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

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }

    addNote() {
        const bookNote = new BookNote();
        bookNote.book_id = this.bookService.getBookMetadata().id;
        bookNote.text_selected = this.textSelected;
        bookNote.cfi_range = this.cfirange;
        bookNote.book_page = this.bookService.getRendition().location.start.displayed.page.toString();
        bookNote.note = this.noteText;

        this.databaseService.insertBookNote(bookNote).then( created => {
            this.rendition.annotations.add('highlight',
                this.cfirange,
                {},
                (e) => {} ,
                "hl",
                {"fill": "yellow", "fill-opacity": "0.3", "mix-blend-mode": "multiply"});
            this.presentToast('Nota creada correctamente');
            this.dismissModal();
        }).catch( error => {
            this.presentToast('Error creando nota');
            console.log(error);
        });

    }
}
