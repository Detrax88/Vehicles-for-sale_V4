import React from 'react'
import ReactDOM from "react-dom/client"
import { AuthProvider } from "./contexts/AuthContext"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { VehicleProvider } from './contexts/VehicleContext.jsx';
import useTheme from './contexts/useTheme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <useTheme>
      <VehicleProvider>
        <BrowserRouter>
        <AuthProvider>
          <App />
          </AuthProvider>
        </BrowserRouter>
      </VehicleProvider>
    </useTheme>
  </StrictMode>,
)
