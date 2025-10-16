import React from 'react';

interface PredictionProps {
    prediction: string;
}

const Prediction: React.FC<PredictionProps> = ({ prediction }) => {
    return prediction ? <p>{prediction}</p> : null;
};

export default Prediction;
