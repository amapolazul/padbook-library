import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.page.html',
  styleUrls: ['./slide.page.scss'],
})
export class SlidePage implements OnInit {
  @ViewChild('slides') slides;

  slideOpts = {
    effect: 'flip',
    loop: false,
    centeredSlides: true,
    scrollbar: false,
    pager: false,
    autoplay: true,
    pagination: false,
    isEnd: true
  };

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    const isEnd = this.slideOpts.isEnd;
    console.log("is end", isEnd);
  }

  clickSlider() {
    const isEnd = this.slides.nativeElement.isEnd();
    console.log("is end", isEnd);
  }

  goToHome() {
    this.navCtrl.navigateRoot('home');
  }
}
