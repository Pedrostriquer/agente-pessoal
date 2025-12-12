import React from 'react';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Background from './components/Background/Background';
import HowItWorks from './components/HowItWorks/HowItWorks';
import UseCases from './components/UseCases/UseCases';
import Transformation from './components/Transformation/Transformation';

function SiteHome() {
  return (
    <div className="App-Site">
      <Background />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <Transformation />
    </div>
  );
}

export default SiteHome;