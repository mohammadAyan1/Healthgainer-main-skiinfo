import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { fetchCart } from "@/redux/slices/cartSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CartBadge() {
    const cartItems = useSelector((state) => state.cart.items);
    const router = useRouter();
    const dispatch = useDispatch();
    
        useEffect(() => {
            dispatch(fetchCart());
        }, [dispatch]);

    return (
        <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
            <FaShoppingCart className="text-2xl text-white" />
            <span
                className={`absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full
                    ${cartItems.length === 0 ? "animate-pulse" : "animate-bounce"}`}
            >
                {cartItems.length}
            </span>
        </div>
    );
}
