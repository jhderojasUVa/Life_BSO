import React from 'react';

interface VideoFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    className?: string;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videoRef, className }) => {
    return <video ref={videoRef} className={className} width="320" height="240" autoPlay playsInline muted></video>;
};

export default VideoFeed;
