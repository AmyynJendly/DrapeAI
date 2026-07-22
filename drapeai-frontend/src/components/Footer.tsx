import Logo from './Logo';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#E5DAC8] pt-16 pb-8 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Newsletter Subscription Box */}
        <div className="bg-[#111111] text-white rounded-[24px] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight max-w-md leading-tight">
            STAY UP TO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <div className="w-full md:w-auto flex flex-col gap-3 min-w-[300px]">
            <div className="flex items-center bg-white rounded-full px-4 py-3 text-black">
              <Mail className="w-4 h-4 text-black/40 mr-3" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-black/40"
              />
            </div>
            <button className="bg-white text-black font-semibold text-sm py-3 px-6 rounded-full hover:bg-white/90 transition text-center cursor-pointer">
              Subscribe to Newsletter
            </button>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-black/10">
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" variant="dark" />
            <p className="text-sm text-black/70 max-w-sm font-medium">
              We have clothes that suit your style and which you're proud to wear. Try them on virtually using our cutting-edge AI engine.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-black mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-black/60">
              <li><a href="#" className="hover:text-black transition">About</a></li>
              <li><a href="#" className="hover:text-black transition">Features</a></li>
              <li><a href="#" className="hover:text-black transition">Works</a></li>
              <li><a href="#" className="hover:text-black transition">Career</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-black mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm text-black/60">
              <li><a href="#" className="hover:text-black transition">Customer Support</a></li>
              <li><a href="#" className="hover:text-black transition">Delivery Details</a></li>
              <li><a href="#" className="hover:text-black transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-black transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-black mb-4">FAQ</h4>
            <ul className="space-y-2.5 text-sm text-black/60">
              <li><a href="#" className="hover:text-black transition">Account</a></li>
              <li><a href="#" className="hover:text-black transition">Manage Deliveries</a></li>
              <li><a href="#" className="hover:text-black transition">Orders</a></li>
              <li><a href="#" className="hover:text-black transition">Payments</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-black/60 gap-4">
          <p>DrapeAI © 2026. All Rights Reserved. Zara / SHOP.CO Inspired UI.</p>
          <p>Spring Boot • MongoDB • React Vite • Docker</p>
        </div>
      </div>
    </footer>
  );
}
