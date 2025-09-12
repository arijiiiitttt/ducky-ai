import React, { useRef } from 'react';
import { NavBar, Footer, GetStartedButton } from './NavAndFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import FAQ from './FAQ';
import Features from './Features';
import VideoBlock from './VideoBlock';


const Homepage = () => {
  
  return (
    <>
      <NavBar />
       <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
            🟠 Made for you Bro
          </span>
        </div>
        <p className="text-3xl Brico font-light">Let's Quack It 🦆</p>
        <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[118px] bowl leading-[1.1]">
         Let Me See 
        </span>
        <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[90px] bowl leading-[1.1] mt-1">
          🫵 Resume
        </span>
        <p className="mt-2 text-lg text-black max-w-2xl mx-auto">
         " Drop it here fast let's make u employed by now "
        </p>

        <div className="flex justify-center">
          <div className="mt-6 flex gap-x-4">
            <a
              className="px-5 py-2.5 Brico rounded-full bg-white text-black text-sm sm:text-[15px] font-medium border border-black/10 shadow-sm hover:bg-black/5"
              href="https://github.com/arijiiiitttt/ducky-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Give ⭐ to my repo
            </a>
            <a
              className="px-6 py-2.5 Brico rounded-full bg-black text-white text-sm sm:text-[15px] font-medium shadow hover:opacity-90"
              href="/content"
            >
              Get started
            </a>
          </div>
        </div>
      </main>
      <VideoBlock/>
    <Features/>
    <FAQ id="faq"/>
    <Footer />
    </>
  );
};

export default Homepage;