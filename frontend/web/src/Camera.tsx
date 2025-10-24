import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Title from './components/Title';
import VideoFeed from './components/VideoFeed';
import CaptureButton from './components/CaptureButton';
import Prediction from './components/Prediction';
import './Camera.css';

const Camera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef1 = useRef<HTMLAudioElement>(null);
    const audioRef2 = useRef<HTMLAudioElement>(null);
    const [currentAudio, setCurrentAudio] = useState<'audio1' | 'audio2'>('audio1');
    const [prediction, setPrediction] = useState<string>('');
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

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

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraOn(false);
        }
    };

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

                            const newAudioPlayer = currentAudio === 'audio1' ? audioRef2.current : audioRef1.current;
                            const oldAudioPlayer = currentAudio === 'audio1' ? audioRef1.current : audioRef2.current;

                            if (newAudioPlayer && oldAudioPlayer) {
                                if(oldAudioPlayer.src !== music_file){
                                    newAudioPlayer.src = `/music/${music_file}`;
                                    newAudioPlayer.volume = 0;
                                    newAudioPlayer.play();
    
                                    fade(oldAudioPlayer, 1, 0, 1000, () => {
                                        oldAudioPlayer.pause();
                                    });
                                    fade(newAudioPlayer, 0, 1, 1000);
    
                                    setCurrentAudio(currentAudio === 'audio1' ? 'audio2' : 'audio1');
                                }
                            } else if(newAudioPlayer){
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
            <audio ref={audioRef1} loop />
            <audio ref={audioRef2} loop />
        </div>
    );
};

export default Camera;