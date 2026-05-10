"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartItem } from "@/types/product";

interface CartState {
  items: CartItem[];
}

type CartIdentity = Pick<CartItem, "productId" | "size" | "color">;

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: CartIdentity }
  | { type: "UPDATE_QUANTITY"; payload: CartIdentity & { quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

interface CartContextValue {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  cartCount: number;
}

const STORAGE_KEY = "oasisxvii-cart";
const MAX_QUANTITY = 99;
const initialState: CartState = { items: [] };

const CartContext = createContext<CartContextValue | null>(null);

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    item.productId.trim().length > 0 &&
    typeof item.size === "string" &&
    item.size.trim().length > 0 &&
    typeof item.color === "string" &&
    item.color.trim().length > 0 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= MAX_QUANTITY
  );
}

function isSameItem(item: CartItem, identity: CartIdentity): boolean {
  return (
    item.productId === identity.productId &&
    item.size === identity.size &&
    item.color === identity.color
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((item) =>
        isSameItem(item, action.payload),
      );

      if (existingIndex === -1) {
        return { items: [...state.items, action.payload] };
      }

      const nextItems = [...state.items];
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + action.payload.quantity,
      };
      return { items: nextItems };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((item) => !isSameItem(item, action.payload)),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => !isSameItem(item, action.payload),
          ),
        };
      }

      return {
        items: state.items.map((item) =>
          isSameItem(item, action.payload)
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    case "HYDRATE":
      return { items: action.payload };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const validItems = parsed.filter(isValidCartItem);
        dispatch({ type: "HYDRATE", payload: validItems });
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cartItems: state.items,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (productId, size, color) =>
        dispatch({ type: "REMOVE_ITEM", payload: { productId, size, color } }),
      updateQuantity: (productId, size, color, quantity) =>
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId, size, color, quantity },
        }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      cartCount,
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
