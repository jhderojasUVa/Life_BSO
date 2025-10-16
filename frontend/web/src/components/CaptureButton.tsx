import React from 'react';

interface CaptureButtonProps {
    onClick: () => void;
    className?: string;
    text: string;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick, className, text }) => {
    return <button onClick={onClick} className={className}>{text}</button>;
};

export default CaptureButton;
