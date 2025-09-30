"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const pathname = usePathname();
  const prevPath = useRef(null);

  useEffect(() => {
    prevPath.current = pathname;
  }, [pathname]);

  return (
    <RouteContext.Provider value={{ previousPath: prevPath.current, currentPath: pathname }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteHistory() {
  return useContext(RouteContext);
}
