"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearUser } from "@/redux/slices/authSlice";

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        localStorage.removeItem("user"); // removes only the "user" key
        localStorage.removeItem("token"); // remove token if needed
        localStorage.removeItem("guestId"); // remove token if needed
        localStorage.removeItem("addToCart"); // remove token if needed

        await dispatch(logout()).unwrap();
        dispatch(clearUser());
        window.location.href = "/login";
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    handleLogout();
  }, [dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-80 bg-gray-100">
      <h1 className="text-2xl font-semibold">Logging out...</h1>
    </div>
  );
};

export default Logout;
