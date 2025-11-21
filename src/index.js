import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={
  <div style={{
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(120deg, #ffffff 0%, #e3effb 50%, #a6c8f5 100%)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    color: '#555',
  }}>
  </div>
}>
  <App />
</Suspense>
  </React.StrictMode>
);

reportWebVitals();
