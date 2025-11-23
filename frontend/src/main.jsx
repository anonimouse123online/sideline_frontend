import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom'; // ✅ Use HashRouter
import App from './App';
import './index.css'; // if you have this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* ✅ This wraps everything in Router context */}
      <App />
    </Router>
  </React.StrictMode>
);