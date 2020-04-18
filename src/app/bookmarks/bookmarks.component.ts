import {Component, OnInit} from '@angular/core';
import {BookService} from '../book/book.service';
import {Router} from '@angular/router';
import {ModalController, ToastController} from '@ionic/angular';
import {BookEntity} from '../library/library.domain';
import {BookMark, BookNote} from '../database/models/library.models';
import {DatabaseService} from '../database/database.service';
import Rendition from 'epubjs/types/rendition';
import {CreateNotesModalPage} from '../home/create-note-modal/create-notes-modal.page';
import {EditNotesModalPage} from '../home/edit-note-modal/edit-notes-modal.page';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

    bookMarks: Array<BookMark> = [];
    bookNotes: Array<BookNote> = [];
    bookMetadata: BookEntity;
    showBookMarks: boolean;
    showNotes: boolean;

    constructor(private bookService: BookService,
                private router: Router,
                private modalController: ModalController,
                private databaseService: DatabaseService,
                public toastController: ToastController) {

        this.bookMetadata = this.bookService.getBookMetadata();
        this.showBookMarks = true;
        this.showNotes = false;
        this.bookMarks = [];
    }

    ngOnInit() {
        this.initializeBookMarks();
        this.initializeBookNotes();
    }

    initializeBookMarks() {
        this.databaseService.getBookMarkList(this.bookService.getBookMetadata().id).then(x => {
            for (let i = 0; i < x.rows.length; i++) {
                const bookMark = <BookMark> x.rows.item(i);
                this.bookMarks.push(bookMark);
            }
        });
    }

    initializeBookNotes() {
        this.databaseService.getNotesbyBookId(this.bookService.getBookMetadata().id).then(x => {
            for (let i = 0; i < x.rows.length; i++) {
                const bookNote = <BookNote> x.rows.item(i);
                this.bookNotes.push(bookNote);
            }
        });
    }

    goToPage(cfi) {
        const rend = <Rendition>this.bookService.getRendition();
        rend.display(cfi);
        this.modalController.dismiss();
    }

    deleteBookMark(bookMark) {
        this.databaseService.deleteBookMark(bookMark).then(x => {
            this.presentToast('Bookmark borrado correctamente');
            this.bookMarks = [];
            this.initializeBookMarks();
        }).catch(err => {
            this.presentToast(err);
        });
    }

    deleteNote(note) {
        this.databaseService.deleteNoteById(note).then(x => {
            this.bookService.getRendition().annotations.remove(note.cfi_range, 'highlight');
            this.presentToast('Nota borrada correctamente');
            this.bookNotes = [];
            this.initializeBookNotes();
        }).catch(err => {
            this.presentToast(err);
        });
    }

    async editNote(note) {
        const modal = await this.modalController.create({
            component: EditNotesModalPage,
            componentProps: {
                'bookNote': note
            }
        });
        return modal.present();
    }


    changeOption() {
        if (this.showBookMarks) {
            this.showBookMarks = false;
            this.showNotes = true;
        } else {
            this.showBookMarks = true;
            this.showNotes = false;
        }
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
