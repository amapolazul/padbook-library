import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BookService} from '../book/book.service';


@Component({
    selector: 'app-slide',
    templateUrl: './slide.page.html',
    styleUrls: ['./slide.page.scss'],
    animations: [
        // the fade-in/fade-out animation.
        trigger('simpleFadeAnimation', [

            state('change1', style({opacity: 1})),
            state('change2', style({opacity: 1})),
            state('change3', style({opacity: 1})),

            transition(':enter', [
                style({opacity: 0}),
                animate(600)
            ]),

            transition(':leave',
                animate(600, style({opacity: 0})))
        ])
    ]
})
export class SlidePage implements OnInit {

    class1 = false;
    class2 = false;
    class3 = false;

    constructor(public navCtrl: NavController,
                public bookService: BookService) {

    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sleep(fn, ...args) {
        await this.timeout(3000);
        return fn(...args);
    }

    ngOnInit() {

        this.sleep(() => {
            this.class1 = true;
            this.class2 = false;
        }).then(() => {
            this.sleep(() => {
                this.class1 = false;
                this.class2 = true;
            }).then(() => {
                this.sleep(() => {
                    this.navCtrl.navigateRoot('home');
                });
            });
        });
    }
}
