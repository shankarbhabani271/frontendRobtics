import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { type Product, mockProducts } from "../data/mockProducts";

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  recentlyViewed: string[]; // product IDs
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
  getRecentlyViewedProducts: () => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("sakrobotix_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("sakrobotix_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem("sakrobotix_recently_viewed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("sakrobotix_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("sakrobotix_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("sakrobotix_recently_viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { id: product.id, quantity, product }];
    });

    // Custom Toast Alert with SweetAlert2
    Swal.fire({
      title: "Added to Cart!",
      text: `${product.name} has been added to your shopping cart.`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#fff",
      color: "#201064",
      iconColor: "#4f46e5"
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    let isAdded = false;
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.includes(productId);
      if (exists) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        isAdded = true;
        return [...prevWishlist, productId];
      }
    });

    const product = mockProducts.find((p) => p.id === productId);
    const productName = product ? product.name : "Product";

    Swal.fire({
      title: isAdded ? "Added to Wishlist" : "Removed from Wishlist",
      text: isAdded
        ? `${productName} has been saved to your wishlist.`
        : `${productName} has been removed from your wishlist.`,
      icon: isAdded ? "success" : "info",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#fff",
      color: "#201064",
      iconColor: isAdded ? "#e11d48" : "#3b82f6"
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8); // Keep last 8 unique items
    });
  };

  const getRecentlyViewedProducts = () => {
    // Return full products for recently viewed IDs
    return recentlyViewed
      .map((id) => mockProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        recentlyViewed,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addRecentlyViewed,
        getRecentlyViewedProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
