import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Settings, Loader2, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBanner from '../components/TopBanner';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { OrderResponsePayload } from '../types/order';

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState<OrderResponsePayload[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
    refreshUser().catch(() => undefined);
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-[#E5DAC8] text-black flex flex-col">
      <TopBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-12 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/45">Account</p>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">Your profile</h1>
            <p className="text-black/60 text-sm max-w-2xl">Manage your details, review recent orders, and jump straight into settings.</p>
          </div>

          <div className="flex gap-3">
            <Link to="/settings" className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link to="/orders" className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-black/10">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-white/75 border border-black/5 shadow-xl p-6 space-y-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-black text-2xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">Signed in as</p>
                <h2 className="text-2xl font-black">{user?.name || 'Guest'}</h2>
                <p className="text-sm text-black/60">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-[#F5EFE6] p-4">
                <p className="text-[11px] uppercase tracking-[0.25em] font-black text-black/40">Preferred size</p>
                <p className="mt-2 font-bold">{user?.preferredSize || 'Not set'}</p>
              </div>
              <div className="rounded-3xl bg-[#F5EFE6] p-4">
                <p className="text-[11px] uppercase tracking-[0.25em] font-black text-black/40">Style</p>
                <p className="mt-2 font-bold">{user?.stylePreference || 'Not set'}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-black text-white p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-black text-white/65">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Quick access
              </div>
              <p className="mt-3 text-sm text-white/75 leading-7">Update your fit, shipping preference, and notification settings from the Settings page.</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[32px] bg-white/75 border border-black/5 shadow-xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-black/40">Recent orders</p>
                <h2 className="text-2xl font-black">Your latest purchases</h2>
              </div>
              <Link to="/orders" className="text-xs font-black uppercase tracking-widest text-black/55 hover:text-black">View all</Link>
            </div>

            {loadingOrders ? (
              <div className="py-16 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="rounded-[28px] bg-[#F5EFE6] p-8 text-center space-y-3">
                <Package className="w-12 h-12 mx-auto text-black/30" />
                <h3 className="text-xl font-black uppercase">No orders yet</h3>
                <p className="text-sm text-black/60">Start browsing the curated catalog to place your first order.</p>
                <Link to="/#catalog" className="inline-flex mt-2 bg-black text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Shop now</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <Link key={order.id} to="/orders" className="block rounded-[24px] bg-[#F5EFE6] border border-black/5 p-4 hover:bg-black hover:text-white transition">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-black opacity-60">Order</p>
                        <p className="font-black">#{order.id}</p>
                        <p className="text-xs opacity-70">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] font-black opacity-60">Total</p>
                        <p className="font-black">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}