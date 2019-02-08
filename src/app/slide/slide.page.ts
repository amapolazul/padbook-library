import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';


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
              animate(600 )
          ]),

          transition(':leave',
              animate(600, style({opacity: 0})))
      ])
  ]
})
export class SlidePage implements OnInit {

  class1 = true;
  class2 = false;
  class3 = false;

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    setTimeout(() => {
        this.class1 = false;
        this.class2 = true;
        setTimeout(() => {
            this.class3 = true;
            this.class2 = false;
            setTimeout(() => {
                this.navCtrl.navigateRoot('home');
            }, 2000);
        }, 2000)
    }, 2000);
  }
}
