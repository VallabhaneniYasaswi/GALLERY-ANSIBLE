import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GalleryHomepage from './components/GalleryHomepage';
import './css/GalleryHomepage.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<GalleryHomepage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

