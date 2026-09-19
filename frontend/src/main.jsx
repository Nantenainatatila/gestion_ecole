import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AnneeProvider } from './context/AnneContext.jsx'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AnneeProvider>
      
      <App />
    </AnneeProvider>
    
  </React.StrictMode>
);
