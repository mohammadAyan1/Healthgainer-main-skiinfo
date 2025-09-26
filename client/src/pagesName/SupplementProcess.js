"use client";
import Image from "next/image";
import { FaFire, FaLeaf, FaSmile, FaUtensils } from "react-icons/fa";

export default function SupplementProcess() {
  return (
    <div className="relative w-full min-h-[350px] md:min-h-[350px] flex items-center justify-center bg-black text-white">
      <div
        className="absolute inset-0 w-full h-full bg-black opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      ></div>

      <div className="relative z-10 w-full max-w-5xl px-6 text-center">
        <p className="text-green-400 text-lg italic">Awesome</p>
        <h2 className="text-3xl md:text-4xl font-bold">Supplement Process</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="flex flex-col items-center">
            <FaFire className="text-green-400 text-4xl mb-2" />
            <p className="text-lg">Burn Calories</p>
          </div>
          <div className="flex flex-col items-center">
            <FaUtensils className="text-green-400 text-4xl mb-2" />
            <p className="text-lg">Suppress Appetite</p>
          </div>
          <div className="flex flex-col items-center">
            <FaLeaf className="text-green-400 text-4xl mb-2" />
            <p className="text-lg">Increase Energy</p>
          </div>
          <div className="flex flex-col items-center">
            <FaSmile className="text-green-400 text-4xl mb-2" />
            <p className="text-lg">Happy Life</p>
          </div>
        </div>
      </div>
    </div>
  );
}
