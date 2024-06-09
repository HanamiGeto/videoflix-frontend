import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Swiper from 'swiper/bundle';

@Component({
  selector: 'vf-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef;

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper() {
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
  }
}
