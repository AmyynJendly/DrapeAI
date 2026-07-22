import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../services/api';
import { OrderResponsePayload } from '../types/order';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBanner from '../components/TopBanner';
import { Package, Clock, CheckCircle2, Truck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponsePayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data);
      } catch (err) {
        console.warn('Backend offline, using sample order fallback history:', err);
        // Fallback sample order for preview
        setOrders([
          {
            id: 'ord-84920',
            userEmail: 'user@drapeai.com',
            items: [
              {
                productId: '1',
                name: 'Retro White Sneakers',
                imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
                price: 85.00,
                quantity: 1,
              },
              {
                productId: '4',
                name: 'Minimalist Black Tee',
                imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
                price: 28.00,
                quantity: 2,
              },
            ],
            subtotal: 141.00,
            shippingFee: 15.00,
            totalAmount: 156.00,
            shippingAddress: {
              fullName: 'John Doe',
              address: '123 High Street',
              city: 'New York',
              postalCode: '10001',
              country: 'United States',
            },
            status: 'PROCESSING',
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EEED] text-black/70 text-xs font-bold">
            <Package className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <TopBanner />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-16 flex-1 w-full space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black">
            MY ORDERS & TRACKING
          </h2>
          <p className="text-black/60 text-sm font-semibold">
            Track your order statuses and review past DrapeAI purchases.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <p className="text-xs text-black/60 font-semibold">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#F0EEED] p-12 rounded-[28px] text-center space-y-4">
            <Package className="w-12 h-12 text-black/30 mx-auto" />
            <h3 className="text-xl font-black uppercase text-black">No Orders Found</h3>
            <p className="text-xs text-black/60 font-medium">You haven't placed any orders yet.</p>
            <Link to="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#F0EEED] p-6 sm:p-8 rounded-[28px] border border-black/5 space-y-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Order Reference</span>
                    <h4 className="text-lg font-black text-black">#{order.id}</h4>
                    <p className="text-xs text-black/60 font-medium mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-xl font-black text-black">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-black/5">
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-[#F0EEED]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-black truncate">{item.name}</p>
                        <p className="text-xs text-black/50 font-medium">Qty: {item.quantity} × ${item.price.toFixed(0)}</p>
                      </div>
                      <span className="text-sm font-extrabold text-black">${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
