import React from 'react';

interface CaptureButtonProps {
    onClick: () => void;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick }) => {
    return <button onClick={onClick}>Start</button>;
};

export default CaptureButton;
