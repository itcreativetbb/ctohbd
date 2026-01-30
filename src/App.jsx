import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import HallOfFame from './components/HallOfFame';
import Guestbook from './components/Guestbook';
import GiftBox from './components/GiftBox';
import DonorTicker from './components/DonorTicker';
import Footer from './components/Footer';

function App() {
  return (
    <Layout>
      <Hero />
      <Timeline />
      <Skills />
      <HallOfFame />
      <Guestbook />
      <GiftBox />
      <DonorTicker />
      <Footer />
    </Layout>
  );
}

export default App;
