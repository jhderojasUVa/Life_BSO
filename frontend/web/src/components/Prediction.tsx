/**
 * @file This file contains the Prediction component.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */
import React from 'react';

/**
 * @interface PredictionProps
 * @description The props for the Prediction component.
 * @property {string} prediction - The prediction to display.
 * @property {string} [className] - The class name to apply to the component.
 */
interface PredictionProps {
    prediction: string;
    className?: string;
}

/**
 * @component Prediction
 * @description This component is responsible for displaying the prediction from the backend.
 * @param {PredictionProps} props - The props for the component.
 * @returns {React.ReactElement | null} The Prediction component.
 */
const Prediction: React.FC<PredictionProps> = ({ prediction, className }) => {
    return prediction ? <p className={className}>{prediction}</p> : null;
};

export default Prediction;
