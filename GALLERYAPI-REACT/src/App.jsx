import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GalleryHomepage from './components/GalleryHomepage';
import './css/GalleryHomepage.css';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import ArtistProfile from './components/ArtistProfile';
import ArtworkManager from './components/ArtworkManager';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<GalleryHomepage />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/artist' element={<Dashboard />} />
        <Route path='/artist/profile' element={<ArtistProfile />} />
        <Route path='/artist/artworks' element={<ArtworkManager />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

