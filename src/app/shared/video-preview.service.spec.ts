import { TestBed } from '@angular/core/testing';

import { VideoPreviewService } from './video-preview.service';

describe('VideoPreviewService', () => {
  let service: VideoPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
