import React from 'react';

interface PredictionProps {
    prediction: string;
    className?: string;
}

const Prediction: React.FC<PredictionProps> = ({ prediction, className }) => {
    return prediction ? <p className={className}>{prediction}</p> : null;
};

export default Prediction;
