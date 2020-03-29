import {Component, OnInit} from '@angular/core';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {BookService} from '../book/book.service';
import {BookmarksService} from '../bookmarks/bookmarks.service';
import {BookMark} from '../bookmarks/bookmark';
import Navigation from 'epubjs/types/navigation';
import {ModalController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HomeModalPage} from './home-modal/home-modal.page';
import {CreateNotesModalPage} from './create-note-modal/create-notes-modal.page';
import Contents from 'epubjs/types/contents';
import * as rangy from 'rangy'
import Section from 'epubjs/types/section';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    book: Book;
    rendition: Rendition;
    navigation: Navigation;
    showElement: boolean;

    constructor(private bookService: BookService,
                private bookMarkService: BookmarksService,
                private modalController: ModalController,
                public toastController: ToastController,
                public plt: Platform,
                private router: Router) {

        this.book = this.bookService.getBook();
        this.rendition = this.book.renderTo('area');
        this.bookService.setRendtion(this.rendition);
        this.rendition.display();
        this.showElement = false;
    }

    ngOnInit() {
        let thisRed = this;

        this.book.ready.then(x => {
            this.navigation = this.book.navigation;
        });

        this.rendition.on('displayed', (event) => {

        });

        this.rendition.on('click', (event) => {
            thisRed.showHeader();
        });

        this.rendition.on("selected", function(cfiRange) {

            this.book.getRange(cfiRange).then(function (range) {

                if (range) {
                    let text = range.toString();
                    let textNode = document.createTextNode(text);
                    thisRed.presentCreateNoteModal(cfiRange, textNode.wholeText);
                }
            });
        });

        this.rendition.hooks.content.register((contents: Contents) => {
            const el = contents.document.documentElement;

            if (el) {

                //Enable swipe gesture to flip a page
                let start: Touch;
                let end: Touch;

                el.addEventListener('touchstart', (event: TouchEvent) => {
                    start = event.changedTouches[0];
                });

                el.addEventListener('touchend', (event: TouchEvent) => {
                    end = event.changedTouches[0];
                    const elBook = document.querySelector('app-home'); //Parent div, which contains the #area div
                    if( elBook ) {
                        const bound = elBook.getBoundingClientRect();
                        const hr = (end.screenX - start.screenX) / bound.width;
                        const vr = Math.abs((end.screenY - start.screenY) / bound.height);
                        if (hr > 0.25 && vr < 0.1) return thisRed.rendition.prev();
                        if (hr < -0.25 && vr < 0.1) return thisRed.rendition.next();
                    }
                });
        }});

        this.plt.backButton.subscribeWithPriority( 9999, () => {
            console.log("not do anything");
        });

        this.rendition.themes.register('dark', 'assets/themes/themes.css');
        this.rendition.themes.register('light', 'assets/themes/themes.css');
    }

    searchBook(event) {
        let searchTerm = event.detail.value;
        if(searchTerm && searchTerm !== '') {
            this.book.spine.each((item: Section) => {
                let a = item.find(searchTerm);
                console.log(a);
            });
        }

        // if(this.book) {
        //     return Promise.all(
        //         this.book.spine.spineItems.map(item => item.load(this.book.load.bind(this.book)).then(item.find.bind(item, searchTerm)).finally(item.unload.bind(item)))
        //     ).then(results => {
        //         console.log(results);
        //         Promise.resolve([].concat.apply([], results))
        //     });
        // }
    }

    // searchBook(search_text){
    //     let searchTerm = search_text.detail.value;
    //     let searchResult = [];
    //
    //     return new Promise((resolve,reject) =>{
    //
    //         this.book.spine.each((item) => {
    //             item.load( this.book.load.bind(this.book) ).then((contents) => {
    //
    //                 let bod = contents.getElementsByTagName('body')[0];
    //
    //                 var rangey = rangy.createRange();
    //                 rangey.selectNode(bod);
    //
    //                 let textNodes = rangey.getNodes([3], (node) => {
    //                     let foo = search_text; //'produce';
    //                     let regExp = new RegExp("\\b" + foo + "\\b", "i"); // the word 'foo'
    //                     return regExp.test(node.data);
    //                 });//the above will obtain all the text nodes within the document body that contain the word in the variable "foo", case insensitively:
    //
    //                 var found: any = [], itemx: any = {}, itemers: any = [];
    //                 textNodes.forEach(textNode => {
    //                     found.push(textNode);
    //                 });
    //                 itemx[item.href] = found;
    //                 itemers.push(item.href);
    //                 for (let itx = 0; itx < itemers.length; itx++) {
    //                     const itemer = itemers[itx];
    //
    //                     if(!((itemer !== this.book.currentHref) && (hog_tie === 'SearchBook'))){
    //                         if(itemx[itemer].length > 0){
    //
    //                             /* what matters */
    //
    //                             // create search value range..
    //                             var reSrange = rangy.createRange();
    //                             (itemx[itemer]).forEach(foundx => {
    //
    //                                 var iot: number = 0;
    //                                 while( foundx.textContent.toLowerCase().indexOf( (search_text).toLowerCase(), iot ) > -1 ){
    //
    //                                     reSrange.setStart(foundx, foundx.textContent.toLowerCase().indexOf( (search_text).toLowerCase(), iot ) )
    //                                     reSrange.setEnd(foundx, foundx.textContent.toLowerCase().indexOf( (search_text).toLowerCase(), iot ) + (search_text).length )
    //
    //                                     let mcontents = this.book.movingContentOBJECT[itemer];//this.ePub.currentHref
    //                                     var searchCFI = mcontents.cfiFromRange( reSrange );
    //
    //                                     this.searchResult.push({
    //                                         href: itemer,//this.ePub.currentHref
    //                                         cfi: searchCFI.toString(),
    //                                         range: reSrange
    //                                     })
    //
    //                                     iot = reSrange.endOffset;
    //                                 }//while
    //
    //                             });
    //
    //                         }
    //                     }//hog_tie
    //                 }//itemers
    //
    //                 return resolve(this.searchResult);
    //
    //             });
    //         });
    //     });
    // }

    showHeader() {
        if(this.showElement) {
            this.showElement = false;
        } else {
            this.showElement = true;
        }
    }

    nextPage() {
        return this.rendition.next();
    }

    prevPage() {
        return this.rendition.prev();
    }

    bookMarkPage() {
        const bookMark = new BookMark();
        bookMark.pageIndex = this.rendition.location.start.index;
        this.bookMarkService.addBookMark(bookMark).then(x => {
            this.presentToast('Marcador guardado correctamente');
        }).catch(err => {
            this.presentToast(err);
            console.log(err);
        });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: HomeModalPage
        });
        return await modal.present();
    }

    async presentCreateNoteModal(cfirange, text) {
        const modal = await this.modalController.create({
            component: CreateNotesModalPage,
            componentProps: {
                'cfirange': cfirange,
                'text': text
            }
        });
        return await modal.present();
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
