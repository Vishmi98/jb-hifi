'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#111111] text-zinc-300 border-t border-zinc-800">
      {/* 1. Newsletter Banner */}
      <div className="bg-jb-yellow text-black py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Mail size={32} className="shrink-0 text-black stroke-[1.5px]" />
            <div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none ticket-font">Get the best deals first!</h3>
              <p className="text-xs font-semibold text-black/70 mt-1">Subscribe to the JB Hi-Fi newsletter for hot deals and member-only perks.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center max-w-md shrink-0">
            <div className="relative flex-1 md:w-80">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-black pl-4 pr-10 py-2.5 rounded-l border-y-2 border-l-2 border-black focus:outline-none text-sm font-semibold"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white hover:bg-zinc-900 border-2 border-black px-5 py-2.5 rounded-r font-extrabold uppercase text-xs tracking-wider transition-colors flex items-center gap-1.5"
            >
              <span>{isSubscribed ? 'Joined!' : 'Subscribe'}</span>
              {!isSubscribed && <Send size={12} />}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Link Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-zinc-800">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Shopping With Us</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold">
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Click & Collect</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Delivery Options</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Gift Cards</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Catalogues</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Brand Index</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Trade-In Programme</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Tax Free Shopping</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Customer Support</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold">
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Help & Support Centre</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Order Status & Tracking</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Returns & Refunds</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Warranty & Repair Info</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Recycling & E-Waste</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Product Recalls</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">About JB Hi-Fi</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold">
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">About Us</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Careers at JB</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Corporate & Investor Relations</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Social Responsibility & Charity</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Modern Slavery Statement</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Terms of Use</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Our Brands & Services</h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold">
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">JB Perks Membership</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">JB Hi-Fi Solutions (Business)</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">JB Hi-Fi Mobile</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">JB Hi-Fi Broadband</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">The Good Guys</Link></li>
            <li><Link href="#" className="hover:text-jb-yellow hover:underline">BYOD Student Portal</Link></li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Bar with Payments & Socials */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-semibold">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span>&copy; {new Date().getFullYear()} JB Hi-Fi. All rights reserved.</span>
          <div className="flex gap-4 mt-1">
            <Link href="#" className="hover:underline hover:text-zinc-400">Terms of Sale</Link>
            <span>&bull;</span>
            <Link href="#" className="hover:underline hover:text-zinc-400">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="#" className="hover:underline hover:text-zinc-400">Sitemap</Link>
          </div>
        </div>

        {/* Socials & Payments */}
        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="#" className="hover:text-white transition-colors" title="Facebook">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-white transition-colors" title="Instagram">
              <svg className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-white transition-colors" title="Twitter/X">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-white transition-colors" title="YouTube">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
          </div>

          {/* Payment Badges (simulated via CSS badges) */}
          <div className="flex flex-wrap items-center gap-1.5 opacity-60">
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">VISA</span>
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">MC</span>
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">PAYPAL</span>
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">AFTERPAY</span>
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">ZIP</span>
            <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
