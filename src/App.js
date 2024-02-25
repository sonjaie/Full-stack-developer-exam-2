import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screen/home';
import history from './history';

const basename = process.env.REACT_APP_BASENAME;

function App() {
  return (
    <Router basename={basename} history={history}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
