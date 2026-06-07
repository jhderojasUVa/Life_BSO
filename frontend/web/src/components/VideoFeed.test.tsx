import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VideoFeed from './VideoFeed';

describe('VideoFeed', () => {
  it('renders video element with expected attributes', () => {
    const videoRef = createRef<HTMLVideoElement>();

    const { container } = render(<VideoFeed videoRef={videoRef} className="video-feed" />);

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveClass('video-feed');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveProperty('muted', true);
  });
});
