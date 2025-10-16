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
    const audioRef = useRef<HTMLAudioElement>(null);
    const [prediction, setPrediction] = useState<string>('');
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isCameraOn) {
                captureAndPredict();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isCameraOn]);

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

    const captureAndPredict = async () => {
        if (videoRef.current && videoRef.current.srcObject && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append('file', blob, 'image.jpg');

                        try {
                            const response = await axios.post('http://localhost:8000/predict', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                            const { object, music_file } = response.data;
                            setPrediction(`Predicted object: ${object}`);
                            if (audioRef.current) {
                                audioRef.current.src = `http://localhost:8000/music/${music_file}`;
                                audioRef.current.play();
                            }
                        } catch (error) {
                            console.error('Error predicting the image:', error);
                        }
                    }
                }, 'image/jpeg');
            }
        }
    };

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
            <audio ref={audioRef} />
        </div>
    );
};

export default Camera;
