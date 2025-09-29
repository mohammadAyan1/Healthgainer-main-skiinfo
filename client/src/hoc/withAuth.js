"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent, allowedRoles) => {
  return function AuthenticatedComponent(props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");



      let userRole = null;
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userRole = parsedUser.role;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      if (!token || !allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <p>Loading...</p>;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
