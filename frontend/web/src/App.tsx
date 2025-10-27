/**
 * @file This file contains the main component of the application, the App component.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */
import Camera from './Camera';
import './App.css';

/**
 * @component App
 * @description This is the main component of the application. It renders the Camera component.
 * @returns {JSX.Element} The App component.
 */
function App() {
    return (
        <div className="App">
            <Camera />
        </div>
    );
}

export default App;