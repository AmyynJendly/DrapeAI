import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Settings, User, Shirt, BellRing, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBanner from '../components/TopBanner';
import { useAuth } from '../context/AuthContext';
import { accountApi } from '../services/api';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredSize, setPreferredSize] = useState('');
  const [stylePreference, setStylePreference] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setPreferredSize(user.preferredSize || '');
      setStylePreference(user.stylePreference || '');
      setNewsletterOptIn(Boolean(user.newsletterOptIn));
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await accountApi.updateMe({
        name,
        phone,
        preferredSize,
        stylePreference,
        newsletterOptIn,
      });
      await refreshUser();
      setMessage('Settings saved successfully.');
      navigate('/account');
    } catch (err) {
      setMessage('Unable to save settings right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5DAC8] text-black flex flex-col">
      <TopBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] bg-white/80 border border-black/5 shadow-xl p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40">Account settings</p>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mt-1">Preferences</h1>
              <p className="text-sm text-black/60 mt-3 max-w-2xl">Keep your profile up to date so orders, size guidance, and notifications feel personal.</p>
            </div>
            <Link to="/account" className="text-xs font-black uppercase tracking-widest text-black/55 hover:text-black">Back to account</Link>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl bg-[#F5EFE6] border border-black/5 p-4 text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-black/45 flex items-center gap-2"><User className="w-4 h-4" /> Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-black/45 flex items-center gap-2"><Settings className="w-4 h-4" /> Phone</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0100" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-black/45 flex items-center gap-2"><Shirt className="w-4 h-4" /> Preferred size</span>
                <select value={preferredSize} onChange={(e) => setPreferredSize(e.target.value)} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black">
                  <option value="">Select size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-black/45">Style preference</span>
                <input value={stylePreference} onChange={(e) => setStylePreference(e.target.value)} placeholder="Minimal, streetwear, tailored..." className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-[24px] bg-[#F5EFE6] border border-black/5 p-5 cursor-pointer">
              <input type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} className="mt-1 h-4 w-4 rounded border-black/20" />
              <span>
                <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><BellRing className="w-4 h-4" /> Email updates</span>
                <span className="block mt-1 text-sm text-black/60">Receive product drops, order updates, and styling notes.</span>
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save settings
              </button>
              <Link to="/orders" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest border border-black/10">
                View orders
              </Link>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}