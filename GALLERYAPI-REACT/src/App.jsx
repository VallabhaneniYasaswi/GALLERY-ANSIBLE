import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GalleryHomepage from './components/GalleryHomepage';
import './css/GalleryHomepage.css';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<GalleryHomepage />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

