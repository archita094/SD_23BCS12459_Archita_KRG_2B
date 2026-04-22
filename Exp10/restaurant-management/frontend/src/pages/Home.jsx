import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="glass-panel p-12 md:p-20 rounded-2xl text-center max-w-3xl animate-slide-up">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
          Experience <span className="text-primary italic">Culinary</span> Magic
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Welcome to AP Restaurant, where every dish is a masterpiece and every evening is an unforgettable journey. Reserve your table today and join us for an evening of exceptional dining.
        </p>
        <Link to="/book">
          <button className="btn-primary text-lg px-8 py-4 shadow-orange-500/20 active:scale-95">
            Book Your Experience
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
