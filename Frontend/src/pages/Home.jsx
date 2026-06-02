import React from 'react';
import Navbar from '../components/Navbar';
import HomeBanner from '../components/HomeBanner';
import HomeCars from '../components/HomeCars';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import EngineStartButton from '../components/EngineIntro';

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <EngineStartButton />
      <Navbar />
      <HomeBanner />
      <HomeCars />
      <Testimonials />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
