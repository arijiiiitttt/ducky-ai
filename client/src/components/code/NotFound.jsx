import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-amber-600 flex items-center justify-center p-4 font-inter text-gray-800">
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto space-y-10 lg:space-y-0 lg:space-x-20 px-4 py-8">

        {/* Image from Public Folder */}
        <div className="relative w-full max-w-md h-auto lg:w-1/2 flex justify-center items-center">
          <img
            src="./images/notfound.png" // Path to the image in the public folder
            alt="Under Construction"
            className="w-full h-auto object-contain" // Ensures image scales and fits within its container
          />
        </div>

        {/* Text Content */}
        <div className="text-center lg:text-left animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-gray-900">
            Oops!
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-md mx-auto lg:mx-0">
            We couldn't find the page you were looking for.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 12v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7 7-7M19 12v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Go home
          </a>
        </div>
      </div>

      {/* Custom CSS for font and animation */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        `}
      </style>
    </div>
  );
};

export default NotFound;