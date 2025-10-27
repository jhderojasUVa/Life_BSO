/**
 * @file This file contains the CaptureButton component.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */

/**
 * @interface CaptureButtonProps
 * @description The props for the CaptureButton component.
 * @property {() => void} onClick - The function to call when the button is clicked.
 * @property {string} text - The text to display on the button.
 */
interface CaptureButtonProps {
    onClick: () => void;
    text: string;
}

/**
 * @component CaptureButton
 * @description This component is responsible for displaying the capture button.
 * @param {CaptureButtonProps} props - The props for the component.
 * @returns {JSX.Element} The CaptureButton component.
 */
const CaptureButton = ({ onClick, text }: CaptureButtonProps) => {
    return <button onClick={onClick}>{text}</button>;
};

export default CaptureButton;
