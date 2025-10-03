"use client";

import React from "react";

const Update = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-black">
          Update your website
        </h1>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Update;
