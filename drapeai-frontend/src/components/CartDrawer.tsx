import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cartItems, cartCount, cartSubtotal, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex justify-end">
        {/* Backdrop overlay click to close */}
        <div
          className="absolute inset-0"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Slide-out Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-black/5"
        >
          {/* Header */}
          <div className="p-6 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                YOUR CART <span className="text-xs font-bold text-black/40">({cartCount})</span>
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full bg-[#F0EEED] hover:bg-black hover:text-white transition active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-[#F0EEED] flex items-center justify-center text-black/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black uppercase text-black">Your Cart is Empty</h4>
                <p className="text-xs text-black/60 font-medium max-w-xs">
                  Browse our catalog and add your favorite high-street garments to your cart.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-[#F0EEED] flex items-center gap-4 border border-black/5 relative group"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-black truncate pr-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-black/60 font-medium capitalize">
                      {item.product.category}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-black text-black">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center bg-white rounded-full px-2 py-1 border border-black/10 gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-black/60 hover:text-black p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-black min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-black/60 hover:text-black p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-black/10 bg-white space-y-4">
              <div className="space-y-2 text-xs font-medium text-black/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-black">$15.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-black/5 text-sm font-black text-black">
                  <span>Total</span>
                  <span>${(cartSubtotal + 15).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="shimmer-btn w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-black/90 flex items-center justify-center gap-2 transition shadow-xl active:scale-95 cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
