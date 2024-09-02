import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Video } from './video';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAll(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}content/videos/`).pipe(
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );
  }

  getSingle(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}content/videos/${id}/`);
  }

  getMyList(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}content/my-videos/`).pipe(
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );
  }

  updateMyList(video: Video): Observable<Video> {
    return this.http.patch<Video>(`${this.apiUrl}content/my-videos/`, video);
  }

  isVideoInMyList(videoId: number): Observable<boolean> {
    return this.getMyList().pipe(
      map((videos) => videos.some((video) => video.id === videoId)),
    );
  }
}
