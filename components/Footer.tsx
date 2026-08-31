'use client';

import React from 'react';

import { FOOTER_DATA, PAYMENT_METHODS } from '@/constants/data';


// Custom SVG Icons
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7a6.34 6.34 0 0010.83 4.47V11.2a8.27 8.27 0 004.85 1.56V9.31a4.82 4.82 0 01-2.91-1.29z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f4f4] text-[#333333] pt-12 pb-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-[95%] md:w-[90%] max-w-[1280px]">
        {/* Main Footer Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12">

          {/* Brand Info & Social Links */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="logo font-black text-[28px] sm:text-[34px] leading-[0.8] tracking-[-0.06em] whitespace-nowrap skew-x-[-5deg]">
                JB HI-FI
              </div>
              <p className="text-[#555555] text-sm leading-snug mt-3">
                Australia&apos;s largest home entertainment retailer.
              </p>
            </div>

            {/* Social Media Buttons */}
            <div className="flex items-center gap-2 mt-6 md:mt-0">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 bg-[#e4e4e4] hover:bg-[#d8d8d8] text-black flex items-center justify-center rounded-xs transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 bg-[#e4e4e4] hover:bg-[#d8d8d8] text-black flex items-center justify-center rounded-xs transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="w-8 h-8 bg-[#e4e4e4] hover:bg-[#d8d8d8] text-black flex items-center justify-center rounded-xs transition-colors"
              >
                <TikTokIcon />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 bg-[#e4e4e4] hover:bg-[#d8d8d8] text-black flex items-center justify-center rounded-xs transition-colors"
              >
                <YoutubeIcon />
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-8 h-8 bg-[#e4e4e4] hover:bg-[#d8d8d8] text-black flex items-center justify-center rounded-xs transition-colors"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FOOTER_DATA.map((col) => (
              <div key={col.title}>
                <h3 className="footer-titles md:text-lg">
                  {col.title}
                </h3>
                <ul className="space-y-3 text-[14px] mt-5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[#444444] hover:text-black hover:underline transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Payment Methods Badges Grid */}
          <div className="lg:col-span-2 flex justify-start lg:justify-end">
            <div className="grid grid-cols-4 md:grid-cols-2 w-full gap-2 md:gap-0">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="h-10"
                >
                  <img
                    src={method.image}
                    alt={method.name}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-300 mb-6" />

        {/* Bottom Legal Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[13px] text-[#555555] gap-4">
          <div>©2026 JB Hi-Fi All rights reserved</div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <a href="#" className="hover:text-black hover:underline transition-colors">
              Consumer guarantees
            </a>
            <a href="#" className="hover:text-black hover:underline transition-colors">
              Privacy policy
            </a>
            <a href="#" className="hover:text-black hover:underline transition-colors">
              Terms of use
            </a>
            <a href="#" className="hover:text-black hover:underline transition-colors">
              Terms of sale
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}