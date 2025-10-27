/**
 * @file This file contains the main component of the application, the Camera component.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Title from './components/Title';
import VideoFeed from './components/VideoFeed';
import CaptureButton from './components/CaptureButton';
import Prediction from './components/Prediction';
import './Camera.css';

/**
 * @component Camera
 * @description This is the main component of the application. It handles the camera, the prediction, and the audio.
 * It uses two audio elements to create a crossfade effect between the audio files when a different object is detected.
 * @returns {JSX.Element} The Camera component.
 */
const Camera = () => {
    // Refs for the video, canvas, and audio elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef1 = useRef<HTMLAudioElement>(null);
    const audioRef2 = useRef<HTMLAudioElement>(null);

    // State variables
    const [currentAudio, setCurrentAudio] = useState<'audio1' | 'audio2'>('audio1'); // The current audio player
    const [prediction, setPrediction] = useState<string>(''); // The prediction from the backend
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false); // Whether the camera is on or off

    /**
     * @function startCamera
     * @description Starts the camera and sets the videoRef to the stream.
     * @returns {Promise<void>}
     */
    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraOn(true);
            } catch (error) {
                console.error('Error accessing the camera:', error);
            }
        }
    };

    /**
     * @function stopCamera
     * @description Stops the camera and removes the stream from the videoRef.
     * @returns {void}
     */
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraOn(false);
        }
    };

    /**
     * @function fade
     * @description Fades the volume of an audio element from a start to an end volume over a given duration.
     * @param {HTMLAudioElement} element - The audio element to fade.
     * @param {number} start - The starting volume.
     * @param {number} end - The ending volume.
     * @param {number} duration - The duration of the fade in milliseconds.
     * @param {() => void} [onComplete] - A callback function to call when the fade is complete.
     * @returns {void}
     */
    const fade = useCallback((element: HTMLAudioElement, start: number, end: number, duration: number, onComplete?: () => void) => {
        let current = start;
        const increment = (end - start) / (duration / 50);
        const interval = setInterval(() => {
            current += increment;
            element.volume = current;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(interval);
                element.volume = end;
                if (onComplete) {
                    onComplete();
                }
            }
        }, 50);
    }, []);

    /**
     * @function captureAndPredict
     * @description Captures a frame from the video, sends it to the backend for prediction, and handles the audio crossfade.
     * @returns {Promise<void>}
     */
    const captureAndPredict = useCallback(async () => {
        if (videoRef.current && videoRef.current.srcObject && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append('file', blob, 'image.jpg');

                        try {
                            const response = await axios.post('/api/predict', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                            const { object, music_file } = response.data;
                            setPrediction(`Predicted object: ${object}`);

                            // Determine which audio player is the new one and which is the old one
                            const newAudioPlayer = currentAudio === 'audio1' ? audioRef2.current : audioRef1.current;
                            const oldAudioPlayer = currentAudio === 'audio1' ? audioRef1.current : audioRef2.current;

                            if (newAudioPlayer && oldAudioPlayer) {
                                // If the new music file is different from the old one, then crossfade
                                if(oldAudioPlayer.src !== music_file){
                                    newAudioPlayer.src = `/music/${music_file}`;
                                    newAudioPlayer.volume = 0;
                                    newAudioPlayer.play();
    
                                    // Fade out the old audio player and pause it when the fade is complete
                                    fade(oldAudioPlayer, 1, 0, 1000, () => {
                                        oldAudioPlayer.pause();
                                    });
                                    // Fade in the new audio player
                                    fade(newAudioPlayer, 0, 1, 1000);
    
                                    // Switch the current audio player
                                    setCurrentAudio(currentAudio === 'audio1' ? 'audio2' : 'audio1');
                                }
                            } else if(newAudioPlayer){ // If there is no old audio player, just play the new one
                                newAudioPlayer.src = `/music/${music_file}`;
                                newAudioPlayer.volume = 1;
                                newAudioPlayer.play();
                            }

                        } catch (error) {
                            console.error('Error predicting the image:', error);
                        }
                    }
                }, 'image/jpeg');
            }
        }
    }, [currentAudio, fade]);

    /**
     * @function useEffect
     * @description This effect runs every 10 seconds and calls the captureAndPredict function if the camera is on.
     * @param {() => void} effect - The effect function to run.
     * @param {React.DependencyList} deps - The dependencies for the effect.
     * @returns {void}
     */
    useEffect(() => {
        const interval = setInterval(() => {
            if (isCameraOn) {
                captureAndPredict();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isCameraOn, captureAndPredict]);

    return (
        <div className="camera-container">
            <VideoFeed videoRef={videoRef} className="video-feed" />
            <div className="overlay">
                <Title className="title" />
                <div className="controls">
                    <CaptureButton onClick={isCameraOn ? stopCamera : startCamera} text={isCameraOn ? 'Stop' : 'Start'} />
                    <button onClick={captureAndPredict}>Predict</button>
                </div>
                <Prediction prediction={prediction} className="prediction" />
            </div>
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
            {/* The two audio elements for the crossfade effect */}
            <audio ref={audioRef1} loop />
            <audio ref={audioRef2} loop />
        </div>
    );
};

export default Camera;