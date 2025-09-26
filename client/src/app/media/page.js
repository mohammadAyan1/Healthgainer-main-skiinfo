"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMediaReports } from "@/redux/slices/mediaReport-slice";

const MediaPage = () => {
  const dispatch = useDispatch();
  const { mediaReports, loading } = useSelector((state) => state.mediaReports);

  useEffect(() => {
    dispatch(fetchMediaReports());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Media and Reports</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading media reports...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaReports.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.iconUrl}
                      alt={item.title}
                      className="w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="px-4 py-1">
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h2>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-800 hover:text-blue-600 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
