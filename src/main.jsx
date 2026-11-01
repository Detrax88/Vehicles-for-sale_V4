import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { VehicleProvider } from './contexts/VehicleContext.jsx';
import useTheme from './contexts/useTheme.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <useTheme>
      <VehicleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VehicleProvider>
    </useTheme>
  </StrictMode>,
)
