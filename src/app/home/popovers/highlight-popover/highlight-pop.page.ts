import {Component, Input, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../../../book/book.service';
import {ModalController, PopoverController, ToastController} from '@ionic/angular';
import {FontSizePopPage} from '../font-size/font-size-pop.page';
import {CreateNotesModalPage} from '../../create-note-modal/create-notes-modal.page';
import {DatabaseService} from '../../../database/database.service';
import {HighLight} from '../../../database/models/library.models';
import {ColorDictionaryService} from '../../../commons/color-dictionary.service';


@Component({
    selector: 'app-font-pop',
    templateUrl: 'highlight-pop.html',
    styleUrls: ['highlight-pop.page.scss'],
})
export class HighlightPopPage implements OnInit {

    @Input() cfirange: string;
    @Input() text: string;

    book: Book;
    rendition: Rendition;
    isHighLight: boolean;

    constructor( private popoverController: PopoverController,
                 private modalController: ModalController,
                 private bookService: BookService,
                 private dataBaseService: DatabaseService,
                 private toastController: ToastController,
                 private colorDictionaryService: ColorDictionaryService
                 ) {

        this.isHighLight = false;

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();
    }

    ngOnInit() {

    }

    showHighLightOptions() {
        this.isHighLight = true;
    }

    closePopOver() {
        this.popoverController.dismiss();
    }

    async presentCreateNoteModal() {
        const modal = await this.modalController.create({
            component: CreateNotesModalPage,
            componentProps: {
                'cfirange': this.cfirange,
                'text': this.text
            }
        });
        this.popoverController.dismiss();
        return modal.present();
    }

    addNote(color) {
        const colorSelected = this.colorDictionaryService.getColor(color);
        const highLightTS = new HighLight();
        highLightTS.style = color;
        highLightTS.book_id = this.bookService.getBookMetadata().id;
        highLightTS.cfi_range = this.cfirange;
        highLightTS.text_selected = this.text;
        this.dataBaseService.insertHighLight(highLightTS).then( result => {
            this.rendition.annotations.add('highlight', this.cfirange, {}, (e) => {} , "hl", colorSelected);
            this.popoverController.dismiss();
        }, error => {
            this.presentToast('Error subrayando texto: ' + error.toString());
            this.popoverController.dismiss();
        });
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
