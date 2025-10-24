/**
 * @file This file contains the VideoFeed component.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */
import React from 'react';

/**
 * @interface VideoFeedProps
 * @description The props for the VideoFeed component.
 * @property {React.RefObject<HTMLVideoElement | null>} videoRef - The ref to the video element.
 * @property {string} [className] - The class name to apply to the component.
 */
interface VideoFeedProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    className?: string;
}

/**
 * @component VideoFeed
 * @description This component is responsible for displaying the video feed from the camera.
 * @param {VideoFeedProps} props - The props for the component.
 * @returns {React.ReactElement} The VideoFeed component.
 */
const VideoFeed: React.FC<VideoFeedProps> = ({ videoRef, className }) => {
    return <video ref={videoRef} className={className} width="320" height="240" autoPlay playsInline muted></video>;
};

export default VideoFeed;
