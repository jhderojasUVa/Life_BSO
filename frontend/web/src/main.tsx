/**
 * @file This file is the entry point of the application.
 * @author Jesus Angel Hernandez de Rojas
 * @version 1.0.0
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
