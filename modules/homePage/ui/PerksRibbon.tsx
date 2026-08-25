'use client';

import { useState } from 'react';
import { Gift, CheckCircle, Percent } from 'lucide-react';

export default function PerksRibbon() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-black text-white rounded-xl border border-zinc-800 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Background Accent Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-jb-yellow/10 to-transparent pointer-events-none"></div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-jb-red/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Info Column */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 z-10 text-center md:text-left">
          <div className="bg-jb-yellow text-black p-3.5 rounded-xl shrink-0 skew-y-[-2deg] shadow-lg flex items-center justify-center">
            <Gift size={28} className="stroke-[2px]" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="bg-jb-yellow text-black text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                MEMBER BENEFITS
              </span>
              <span className="text-jb-yellow text-xs font-bold flex items-center gap-1">
                <Percent size={12} /> EXCLUSIVE DEALS
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1.5 ticket-font">
              Get a <span className="text-jb-yellow">$10 Welcome Coupon</span> when you join JB Perks!
            </h3>
            <p className="text-xs font-medium text-zinc-400 mt-1 max-w-xl">
              Enjoy exclusive member-only discounts, early access to catalogues, and birthday rewards. It's free to join!
            </p>
          </div>
        </div>

        {/* Input/Action Column */}
        <div className="w-full lg:w-auto shrink-0 z-10">
          {success ? (
            <div className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-3 rounded-lg text-sm font-semibold max-w-sm mx-auto">
              <CheckCircle size={18} />
              <span>Welcome! Check your email for your $10 coupon.</span>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="flex items-center w-full max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter email to join Perks"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full lg:w-64 bg-zinc-900 border-2 border-zinc-800 focus:border-jb-yellow focus:outline-none text-white px-4 py-2.5 rounded-l text-sm font-semibold placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="bg-jb-yellow text-black hover:bg-[#e6bd00] border-y-2 border-r-2 border-jb-yellow hover:border-[#e6bd00] px-5 py-2.5 rounded-r font-extrabold uppercase text-xs tracking-wider transition-colors shrink-0"
              >
                Join Now
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
