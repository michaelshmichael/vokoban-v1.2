import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './components/Routes';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <Routes></Routes>
  </Router>,
  document.getElementById('root')
);

reportWebVitals();
