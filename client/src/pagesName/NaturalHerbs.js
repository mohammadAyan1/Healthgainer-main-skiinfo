'use client';

import React from 'react';
export default function NaturalHerbs() {
  return (
    <section className="bg-white mb-1 border-gray-300 shadow-lg w-full overflow-hidden">

      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-light bg-[#090A0C] py-2 px-4 text-gray-200">
          Ingredients Of{" "}
          <span className="text-lime-500 font-bold">Health Gainer</span>
        </h2>
      </div>

      <img
        className="w-full block md:block"
        src="/best/Ingrediant 1380.700.jpg"
        alt="Ingredients"
        loading="lazy"
      />
    </section>
  );
}
