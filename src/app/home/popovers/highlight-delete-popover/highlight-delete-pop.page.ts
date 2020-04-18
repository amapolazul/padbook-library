import {Component, Input, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../../../book/book.service';
import {ModalController, PopoverController, ToastController} from '@ionic/angular';
import {DatabaseService} from '../../../database/database.service';


@Component({
    selector: 'app-font-pop',
    templateUrl: 'highlight-delete-pop.html',
    styleUrls: ['highlight-delete-pop.page.scss'],
})
export class HighlightDeletePopPage implements OnInit {

    @Input() cfirange: string;

    book: Book;
    rendition: Rendition;

    constructor( private popoverController: PopoverController,
                 private modalController: ModalController,
                 private bookService: BookService,
                 private dataBaseService: DatabaseService,
                 private toastController: ToastController,
                 ) {

        this.book = this.bookService.getBook();
        this.rendition = this.bookService.getRendition();
    }

    ngOnInit() {

    }

    deleteHighLight() {
        this.dataBaseService.deleteHighLightByCfi(this.cfirange).then(resp => {
            this.rendition.annotations.remove(this.cfirange, 'highlight');
            this.presentToast('Subrayado borrado correctamente');
            this.closePopOver();
        }).catch(error => {
            console.log('Error borrando subrayado');
        });
    }

    closePopOver() {
        this.popoverController.dismiss();
    }


    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
