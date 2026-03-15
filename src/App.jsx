import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Shelters from './components/Shelters';
import DogGallery from './components/DogGallery';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-main">
      <Header />
      <main>
        <Hero />
        <Shelters />
        <DogGallery />
      </main>
      <Footer />
    </div>
  );
}

export default App;
