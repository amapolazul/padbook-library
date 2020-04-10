import {Component, Input, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../../../book/book.service';
import {ModalController, PopoverController} from '@ionic/angular';
import {FontSizePopPage} from '../font-size/font-size-pop.page';
import {CreateNotesModalPage} from '../../create-note-modal/create-notes-modal.page';


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
    colorDictionary: Map<String, any>;
    isHighLight: boolean;

    constructor( private popoverController: PopoverController,
                 private modalController: ModalController,
                 private bookService: BookService
                 ) {
        this.colorDictionary = new Map<string, any>();

        this.isHighLight = false;

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();

        this.colorDictionary.set('red', {"fill": "#00FFFF", "fill-opacity": "0.3", "mix-blend-mode": "multiply"} );
        this.colorDictionary.set('blue', {"fill": "blue", "fill-opacity": "0.3", "mix-blend-mode": "multiply"} );
        this.colorDictionary.set('green', {"fill": "green", "fill-opacity": "0.3", "mix-blend-mode": "multiply"} );
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
        let colorSelected = this.colorDictionary.get(color);
        this.rendition.annotations.add('highlight', this.cfirange, {}, (e) => {} , "hl", colorSelected);
        this.popoverController.dismiss();
    }
}
