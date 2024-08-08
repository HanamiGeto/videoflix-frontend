import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { BannerComponent } from '../banner/banner.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { FooterComponent } from '../footer/footer.component';
import { VideoService } from '../shared/video.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class BrowseComponent {
  videoGenres = toSignal(
    inject(VideoService)
      .getAll()
      .pipe(
        map((videos) => {
          const genres = Array.from(
            new Set(videos.map((video) => video.genre_display)),
          );
          return genres;
        }),
      ),
  );
}
