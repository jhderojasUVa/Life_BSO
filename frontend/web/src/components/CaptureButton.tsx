/**
 * @file CaptureButton.tsx
 * @description This component is responsible for displaying the capture button.
 */
import React from 'react';

interface CaptureButtonProps {
    onClick: () => void;
    text: string;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
};

export default CaptureButton;
