'use client';

import { useState } from 'react';
import { CiSearch } from "react-icons/ci";

const categories = ['All', 'Protein', 'Nutrition', 'Vitamins'];

const products = [
    { id: 1, name: 'Health Gainer Prima Force', category: 'Protein', image: '../1.png' },
    { id: 2, name: 'Health Gainer Max', category: 'Life Style', image: '../2.png' },
    { id: 3, name: 'Health Gainer Extract', category: 'Nutrition', image: '../3.png' },
    { id: 4, name: 'Health Gainer Alpha', category: 'Vitamins', image: '../1.png' },
    { id: 5, name: 'Health Gainer Enhance Pro', category: 'Protein', image: '../2.png' },
    { id: 6, name: 'Health Gainer Natural Been', category: 'Life Style', image: '../3.png' },
];

export default function ProductGallery() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(product => product.category === activeCategory);

    return (
        <section className="py-12 px-6 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold text-center">Product Gallery</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto my-4"></div>

            <div className="flex justify-center space-x-4 mt-6 overflow-x-auto">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-lg ${activeCategory === category ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'} transition-all`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="group bg-white text-black shadow-lg rounded-lg overflow-hidden relative hover:-translate-y-2 duration-300"
                    >

                        <div className="w-full h-full transition-all duration-300 opacity-0 group-hover:opacity-100 bg-primary bg-opacity-90 absolute top-0 left-0 flex items-center justify-center">
                            <CiSearch className="text-white text-6xl" />
                        </div>

                        <div className="w-full flex items-center justify-center">
                            <img src={product.image} alt={product.name} className="w-48 h-48 object-cover" />
                        </div>

                        <div className="p-4 text-center  text-black">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm ">{product.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}