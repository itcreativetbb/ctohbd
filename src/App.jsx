import React, { Suspense, lazy, useState, useEffect } from 'react';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';

// Lazy load non-critical components
const Skills = lazy(() => import('./components/Skills'));
const HallOfFame = React.lazy(() => import('./components/HallOfFame'));
const Guestbook = React.lazy(() => import('./components/Guestbook'));
const GiftBox = React.lazy(() => import('./components/GiftBox'));
const DonorTicker = React.lazy(() => import('./components/DonorTicker'));
const SpinToWin = React.lazy(() => import('./components/SpinToWin'));
const Footer = React.lazy(() => import('./components/Footer')); // Assuming Footer exists or creating logic for it

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#0d1117] min-h-screen text-gray-300 font-sans selection:bg-accent selection:text-black scroll-smooth overflow-x-hidden">
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      <Navigation />

      <main className="relative z-10">
        <Hero />
        <Timeline />

        <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading experience...</div>}>
          <Skills />
          <HallOfFame />
          <Guestbook />
          <GiftBox />
          <DonorTicker />
          <SpinToWin />
        </Suspense>
      </main>

      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
