// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 👇 Change this
// import App from './App.tsx';
import App from './App.jsx'; // ✅ Use the correct JSX file
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
