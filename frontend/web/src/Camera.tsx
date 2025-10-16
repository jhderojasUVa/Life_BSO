import React, { useRef, useState } from 'react';
import axios from 'axios';

const Camera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [prediction, setPrediction] = useState<string>('');

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
        if (videoRef.current && canvasRef.current) {
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
            <h1>Object-based Music Player</h1>
            <button onClick={startCamera}>Start Camera</button>
            <video ref={videoRef} width="320" height="240" autoPlay playsInline muted></video>
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
            <button onClick={captureAndPredict}>Capture and Predict</button>
            {prediction && <p>{prediction}</p>}
            <audio ref={audioRef} controls />
        </div>
    );
};

export default Camera;
