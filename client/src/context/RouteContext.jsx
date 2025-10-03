"use client";

import { createContext, useContext, useEffect,useState } from "react";
import { usePathname } from "next/navigation";

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const pathname = usePathname();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory((prev) => {
      // Keep only last 3 (second previous, previous, current)
      const updated = [...prev, pathname];
      return updated.slice(-3);
    });
  }, [pathname]);
  return (
    <RouteContext.Provider
      value={{
        currentPath: pathname,
        previousPath: history[history.length - 2] || null,
        secondPreviousPath: history[history.length - 3] || null,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteHistory() {
  return useContext(RouteContext);
}
