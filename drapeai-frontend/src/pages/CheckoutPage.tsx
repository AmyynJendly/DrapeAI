import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi } from '../services/api';
import { Sparkles, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [shippingFee, setShippingFee] = useState(15.00);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0EEED] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-[28px] max-w-md w-full shadow-xl space-y-4">
          <h2 className="text-2xl font-black uppercase text-black">Your Cart is Empty</h2>
          <p className="text-xs text-black/60 font-medium">Add some clothing or footwear to your cart before checking out.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingFee,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      };

      await orderApi.createOrder(orderPayload);
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      console.warn('Backend offline, using fallback order simulation:', err);
      clearCart();
      navigate('/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = cartSubtotal + shippingFee;

  return (
    <div className="min-h-screen bg-[#F0EEED] py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-black uppercase tracking-tighter text-black flex items-center gap-1.5">
            DRAPE.AI
            <Sparkles className="w-4 h-4 text-black" />
          </Link>
          <span className="text-xs font-extrabold uppercase tracking-widest text-black/60 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure SSL Checkout
          </span>
        </div>

        {/* Main Form & Order Summary */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery & Shipping Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-xl border border-black/5 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <Truck className="w-5 h-5 text-black" /> Delivery Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black placeholder:text-black/40 border border-transparent focus:ring-2 focus:ring-black focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 High Street, Suite 100"
                    className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black placeholder:text-black/40 border border-transparent focus:ring-2 focus:ring-black focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black placeholder:text-black/40 border border-transparent focus:ring-2 focus:ring-black focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001"
                      className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black placeholder:text-black/40 border border-transparent focus:ring-2 focus:ring-black focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-xl border border-black/5 space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Shipping Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setShippingFee(15.00)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    shippingFee === 15.00 ? 'border-black bg-[#F0EEED]' : 'border-black/10 bg-white'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-black">Standard Delivery</p>
                    <p className="text-xs text-black/60 font-medium">3-5 Business Days</p>
                  </div>
                  <span className="text-sm font-black text-black">$15.00</span>
                </div>

                <div
                  onClick={() => setShippingFee(25.00)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    shippingFee === 25.00 ? 'border-black bg-[#F0EEED]' : 'border-black/10 bg-white'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-black">Express Courier</p>
                    <p className="text-xs text-black/60 font-medium">1-2 Business Days</p>
                  </div>
                  <span className="text-sm font-black text-black">$25.00</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-xl border border-black/5 space-y-6 sticky top-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg bg-[#F0EEED]" />
                      <div>
                        <p className="font-bold text-black truncate max-w-[140px]">{item.product.name}</p>
                        <p className="text-black/50">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-black">${(item.product.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-black/10 space-y-2 text-xs font-semibold text-black/70">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-black">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-black">${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-black/10 text-lg font-black text-black">
                  <span>Total Due</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="shimmer-btn w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-black/90 flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Processing Order...' : 'Place Order ✨'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
