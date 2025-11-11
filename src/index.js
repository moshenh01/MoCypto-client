import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// create root is a function that creates a root element for the app
// it returns a root object that can be used to render the app
// it injects the app into the root element in the index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));
// strict mode is a development feature that helps catch potential problems
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

