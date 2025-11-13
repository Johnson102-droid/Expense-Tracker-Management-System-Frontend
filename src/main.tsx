// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store'; // Our store
import App from './App';
import './index.css'; // Our Tailwind styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Make Redux store available to all components */}
    <Provider store={store}>
      {/* Make page routing available to all components */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);