import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { BannerComponent } from '../banner/banner.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'vf-browse',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    BannerComponent,
    CarouselComponent,
    FooterComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent {}
