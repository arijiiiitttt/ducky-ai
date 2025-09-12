"use client";
import React, { useState } from "react";

const VideoBlock = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-fit pt-5 pb-16 flex flex-col items-center justify-center py-10 relative z-0">

      {/* CARD */}
      <section
        className="group relative flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >

        <div className="relative w-[34.32rem] h-[22.88rem] origin-bottom [perspective:1500px] z-10"> {/* Increased width and height by 43% (30% + 10% of 30%) */}
          <div className="bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none transition-all ease duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" />
          <div className="absolute inset-1 bg-zinc-400 rounded-2xl origin-bottom transition-all ease duration-300 group-hover:[transform:rotateX(-20deg)] select-none" />
          <div className="absolute inset-1 bg-zinc-300 rounded-2xl origin-bottom transition-all ease duration-300 group-hover:[transform:rotateX(-30deg)]" />
          <div className="absolute inset-1 bg-zinc-200 rounded-2xl origin-bottom transition-all ease duration-300 group-hover:[transform:rotateX(-38deg)]" />
          <div className="absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[357.5px] rounded-2xl rounded-tr-none transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)] after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[160.6px] after:h-[17.6px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[156.2px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);]" />
        </div>
      </section>

      {/* VIDEO MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl"
          >

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-black text-2xl font-bold z-10"
            >
              &times;
            </button>


            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                src="?autoplay=1"
                title="youTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBlock;