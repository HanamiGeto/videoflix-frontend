export interface Video {
  id: number;
  created_at: Date;
  title: string;
  description: string;
  genre: 'nature' | 'animals' | 'animated';
  video_file: string;
}
