export interface Video {
  id: number;
  created_at: Date;
  title: string;
  description: string;
  genre: 'nature' | 'animals' | 'animated';
  video_file: string;
  video_file_resolutions: VideoResolutions;
  thumbnail_file: string;
}

export interface VideoResolutions {
  _1080p: string;
  _720p: string;
  _360p: string;
}
