import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GalleryHomepage from './components/GalleryHomepage';
import './css/GalleryHomepage.css';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import ArtistProfile from './components/ArtistProfile';
import ArtworkManager from './components/ArtworkManager';
import VisitorDashboard from './components/VisitorDashboard';
import ArtistList from './components/ArtistList';
import Gallery from './components/Gallery';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<GalleryHomepage />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/artist' element={<Dashboard />} />
        <Route path='/artist/profile' element={<ArtistProfile />} />
        <Route path='/artist/artworks' element={<ArtworkManager />} />
        <Route path='/visitor' element={<VisitorDashboard />} />
        <Route path='/visitor/artist-list' element={<ArtistList />} />
        <Route path='/visitor/gallery' element={<Gallery />} />
        <Route path='/visitor/wishlist' element={<Wishlist />} />
        <Route path='/visitor/cart' element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

