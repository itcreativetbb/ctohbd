import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

// Lazy load non-critical components
const Skills = lazy(() => import('./components/Skills'));
const HallOfFame = lazy(() => import('./components/HallOfFame'));
const Guestbook = lazy(() => import('./components/Guestbook'));
const GiftBox = lazy(() => import('./components/GiftBox'));
const DonorTicker = lazy(() => import('./components/DonorTicker'));

function App() {
  return (
    <Layout>
      <Hero />
      <Timeline />
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading experience...</div>}>
        <Skills />
        <HallOfFame />
        <Guestbook />
        <GiftBox />
        <DonorTicker />
      </Suspense>
      <Footer />
    </Layout>
  );
}

export default App;
