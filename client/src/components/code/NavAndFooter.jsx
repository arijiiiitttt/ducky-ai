import React, { useState } from 'react';
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const MotionLink = motion(Link);

export const GetStartedButton = () => (
  <button className='group relative cursor-pointer p-2 w-32 border-2 border-amber-600 hover:border-amber-800 bg-white rounded-full overflow-hidden text-amber-600 text-center font-semibold'>
    {/* Default Button Text */}
    <span className='translate-x-1 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-300 inline-block'>
      Get Started
    </span>

    {/* Hover State Button Text with Arrow */}
    <div className='flex gap-2 text-white z-10 items-center absolute top-0 h-full w-full justify-center translate-x-12 opacity-0 group-hover:-translate-x-1.5 group-hover:opacity-100 transition-all duration-300'>
      <span>Get Started</span>
      <FaArrowRight/>
    </div>

    {/* Animated Background Element */}
    <div className='absolute top-[40%] left-[9%] h-2 w-2 group-hover:h-full group-hover:w-full rounded-lg bg-amber-500 scale-[1] group-hover:bg-amber-500 group-hover:scale-[1.8] transition-all duration-300 group-hover:top-[0%] group-hover:left-[0%]'></div>
  </button>
);

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleScrollToFeatures = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("features");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = "/#features";
    }
  };

  const handleScrollToFAQ = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("faq");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = "/#faq";
    }
  };

  const navLinkVariants = {
    hover: {
      scale: 1.1,
      y: -3,
      transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
    },
    tap: {
      scale: 0.95
    }
  };

  const mobileMenuVariants = {
    hidden: {
      x: '-100%',
      transition: { duration: 0.2, when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
    },
    visible: {
      x: 0,
      transition: { duration: 0.25, when: "beforeChildren", staggerChildren: 0.07, ease: "easeOut" }
    }
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <>
      {/* Main Navigation Bar Component */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="navbar shadow-sm rounded-full scale-90 sticky top-4 z-50" 
        aria-label="primary-navigation"
      >
        <div className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full Brico">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <img src="./logos/duckyai-s.png" alt="Logo Icon" className="h-10 w-10 rounded-full"/>
          </div>
  
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <MotionLink to="/" className="text-black text-lg hover:text-amber-600" variants={navLinkVariants} whileHover="hover" whileTap="tap">Home</MotionLink>
            <MotionLink
              onClick={handleScrollToFeatures}
              className="text-black text-lg hover:text-amber-600"
              variants={navLinkVariants} whileHover="hover" whileTap="tap"
            >
              Features
            </MotionLink>
            <MotionLink
              onClick={handleScrollToFAQ}
              className="text-black text-lg hover:text-amber-600"
              variants={navLinkVariants} whileHover="hover" whileTap="tap"
            >
              FAQ
            </MotionLink>
            <MotionLink to="/about" className="text-black text-lg hover:text-amber-600" variants={navLinkVariants} whileHover="hover" whileTap="tap">About</MotionLink>
          </div>
  
          {/* Desktop Get Started Button */}
          <div className="hidden md:flex items-center justify-end w-32">
            <SignedOut>
              <Link to="/content">   {/* <-- fixed here */}
                <GetStartedButton />
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl='/' />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="relative z-50 w-6 h-6 text-amber-600 focus:outline-none">
              <svg width="100%" height="100%" viewBox="0 0 23 23">
                <motion.path
                  fill="transparent"
                  strokeWidth="3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" }
                  }}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  d="M 2 9.423 L 20 9.423"
                  fill="transparent"
                  strokeWidth="3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.1 }}
                />
                <motion.path
                  fill="transparent"
                  strokeWidth="3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" }
                  }}
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden fixed inset-0 bg-white z-40"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <MotionLink to="/" variants={mobileLinkVariants} className="text-2xl text-black hover:text-amber-600">Home</MotionLink>
              <button 
                onClick={() => { setIsOpen(false); handleScrollToFeatures(); }}
                className="text-2xl text-black hover:text-amber-600"
              >
                Features
              </button>
              <button 
                onClick={() => { setIsOpen(false); handleScrollToFAQ(); }}
                className="text-2xl text-black hover:text-amber-600"
              >
                FAQ
              </button>
              <MotionLink to="/about" variants={mobileLinkVariants} className="text-2xl text-black hover:text-amber-600">About</MotionLink>
              <motion.div variants={mobileLinkVariants}>
                <SignedOut>
                  <Link to="/content">  {/* <-- fixed here too */}
                    <GetStartedButton />
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl='/' />
                </SignedIn>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-amber-900 text-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left Side: Logo and Brand Name */}
          <Link to="/" className="flex items-center gap-3">
            <img src="./logos/duckyai-s.png" alt="Ducky AI Logo" className="h-12 w-12 rounded-full border-2 border-amber-500 p-1" />
            <span className="font-bold text-2xl text-white">Ducky AI</span>
          </Link>

          {/* Right Side: Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2" aria-label="Footer navigation">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1 hover:text-amber-400 transition-colors duration-300 cursor-pointer">Back to Top <FaArrowUp/></button>
          </nav>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 pt-6 border-t border-amber-700 text-center">
          <p className="text-sm text-amber-500">&copy; {new Date().getFullYear()} Ducky AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
