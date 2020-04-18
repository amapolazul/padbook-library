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
    templateUrl: 'edit-note-modal.page.html',
    styleUrls: ['edit-modal.page.scss'],
})
export class EditNotesModalPage implements OnInit {

    book: Book;
    rendition: Rendition;
    navigation: Navigation;

    textSelected: string;
    noteText: string;

    @Input() bookNote: BookNote;


    constructor(private bookService: BookService,
                private toastController: ToastController,
                private databaseService: DatabaseService,
                private modalController: ModalController) {

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();
    }

    ngOnInit() {
        this.noteText = this.bookNote.note;
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

    editNote() {
        this.bookNote.note = this.noteText;
        this.databaseService.updateNoteBook(this.bookNote).then( created => {
            this.presentToast('Nota actualizada correctamente correctamente');
            this.dismissModal();
        }).catch( error => {
            this.presentToast('Error actualizando nota nota');
            console.log(error);
        });

    }
}
