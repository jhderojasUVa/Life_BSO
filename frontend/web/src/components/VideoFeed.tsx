import React from 'react';

interface VideoFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videoRef }) => {
    return <video ref={videoRef} width="320" height="240" autoPlay playsInline muted></video>;
};

export default VideoFeed;
