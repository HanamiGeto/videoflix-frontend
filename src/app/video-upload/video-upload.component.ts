type FormGroupTyped<T> = {
  [P in keyof T]: FormControl<T[P]>;
};

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { HeaderComponent } from '../header/header.component';
import { VideoService } from '../shared/video.service';
import { GENRES, VideoUpload } from '../shared/video';

@Component({
  selector: 'vf-video-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorsComponent,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss',
})
export class VideoUploadComponent {
  private videoService = inject(VideoService);
  genres = GENRES;
  private file: File | null = null;

  form = new FormGroup<FormGroupTyped<VideoUpload>>({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    genre: new FormControl(null, {
      validators: Validators.required,
    }),
    video_file: new FormControl(null, {
      validators: Validators.required,
    }),
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.file) {
      const formData = new FormData();
      const formValue: VideoUpload = {
        ...this.form.getRawValue(),
        video_file: this.file,
      };
      Object.keys(formValue).forEach((key) => {
        const value = formValue[key as keyof VideoUpload];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      this.videoService.create(formData).subscribe((data) => {
        console.log(data);
      });
    }
  }
}
