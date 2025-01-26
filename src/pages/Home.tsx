import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Partners from '../components/Partners';
import Projects from '../components/Projects';
import News from '../components/News';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

const Home = () => {
  const { t } = useI18n();

  return (
    <PageTransition>
      <Hero />
      <Features />
      <Partners />
      <Projects />
      <News />
    </PageTransition>
  );
};

export default Home;