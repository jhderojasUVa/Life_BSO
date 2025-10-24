/**
 * @file This file contains the Title component.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */
import React from 'react';

/**
 * @interface TitleProps
 * @description The props for the Title component.
 * @property {string} [className] - The class name to apply to the component.
 */
interface TitleProps {
    className?: string;
}

/**
 * @component Title
 * @description This component is responsible for displaying the title of the application.
 * @param {TitleProps} props - The props for the component.
 * @returns {React.ReactElement} The Title component.
 */
const Title: React.FC<TitleProps> = ({ className }) => {
    return <h1 className={className}>Life BSO</h1>;
};

export default Title;
