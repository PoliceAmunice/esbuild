import React from 'react';
import * as Client from 'react-dom/client';
import App from './App';


const reactRoot = document.getElementById('react-root');

if (!reactRoot) {
  throw new Error('react-root was not found');
}

Client
  .createRoot(reactRoot)
  .render(<App />)
;
