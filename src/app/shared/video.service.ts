import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Video, VideoUpload } from './video';

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

  create(video: FormData): Observable<VideoUpload> {
    return this.http.post<VideoUpload>(`${this.apiUrl}content/videos/`, video);
  }
}
