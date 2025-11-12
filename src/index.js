import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
// strict mode will render twice for components that use effect, but will be disabled in production.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

