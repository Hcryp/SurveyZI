import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';

// Option 1: Using BrowserRouter with future flags
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>,
);
