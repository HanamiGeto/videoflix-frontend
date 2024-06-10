import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import Swiper from 'swiper/bundle';

@Component({
  selector: 'vf-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  @ViewChild('swiper') private swiper!: ElementRef;

  constructor() {
    afterNextRender(() => {
      return new Swiper(this.swiper.nativeElement, {
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: true,
        spaceBetween: 5,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      })
    })
  }
}
