import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Title from './components/Title';
import VideoFeed from './components/VideoFeed';
import CaptureButton from './components/CaptureButton';
import Prediction from './components/Prediction';

const Camera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [prediction, setPrediction] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            captureAndPredict();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing the camera:', error);
            }
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
        <div>
            <Title />
            <VideoFeed videoRef={videoRef} />
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
            <CaptureButton onClick={startCamera} />
            <button onClick={captureAndPredict}>Predict</button>
            <Prediction prediction={prediction} />
            <audio ref={audioRef} />
        </div>
    );
};

export default Camera;
